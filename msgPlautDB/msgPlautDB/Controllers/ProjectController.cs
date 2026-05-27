using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using msgPlautDB.Data;
using msgPlautDB.DTOs;
using msgPlautDB.Models;
using System.Net.WebSockets;
using System.Security.Claims;

namespace msgPlautDB.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-projects")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProjectListDTO>>> GetMyProjects()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            var userId = Guid.Parse(userIdString);

            var projects = await _context.ProjectAssignments
                .Where(pa => pa.EmployeeId == userId)
                .Select(pa => new ProjectListDTO
                {
                    ProjectId = pa.ProjectId,
                    Name = pa.Project.Name,
                    StartTime = pa.Project.StartTime,
                    EndTime = pa.Project.EndTime,
                    AssignmentState = pa.state
                })
                .ToListAsync();

            return Ok(projects);
        }

        [HttpPost("projects")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateProject([FromBody] CreateProjectDTO dto)
        {
            if (dto == null) return BadRequest("Data projektu chybí");

            var newProject = new Project
            {
                ProjectId = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                Customer = dto.Customer,
                Location = dto.Location,
                UniqueKey = dto.UniqueKey,
                Branch = dto.Branch,
                Language = dto.Language,
                StartTime = dto.StartTime,
                EndTime = null,
                EmployeeAssignments = new List<ProjectAssignment>()
            };

            foreach (var employeeId in dto.AssignedEmployeeIds)
            {
                newProject.EmployeeAssignments.Add(new ProjectAssignment
                {
                    ProjectAssignmentId = Guid.NewGuid(),
                    ProjectId = newProject.ProjectId,
                    EmployeeId = employeeId,
                    state = "nový"
                });
            }

            _context.Projects.Add(newProject);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Projekt byl úspěsně vytvořen.", projectId = newProject.ProjectId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Při ukládání projektu došlo k chybě");
            }

        }

        [HttpPost("ActivityAssignment")]
        public async Task<ActionResult> CreateAcitivity([FromBody] CreateActivityDTO dto)
        {
            if (dto == null) return BadRequest("Chybí Data");
            var newActivity = new Activity
            {
                ActivityId = Guid.NewGuid(),
                ActivityName = dto.ActivityName,
            };

            _context.Activities.Add(newActivity);

            _context.SaveChanges();
            return Ok(newActivity);
        }

        [HttpPost("activate")]
        public async Task<IActionResult> ActivateProject([FromBody] ProjectActivationDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var assignment = await _context.ProjectAssignments
                .FirstOrDefaultAsync(pa => pa.ProjectId == dto.ProjectId && pa.EmployeeId == userId);

            if (assignment == null) return NotFound("Přiřazení nebylo nalezeno.");

            var existing = _context.ActivityAssignments
                .Where(aa => aa.ProjectAssingnmentId == assignment.ProjectAssignmentId);
            _context.ActivityAssignments.RemoveRange(existing);

            var assignments = dto.SelectedActivities.Take(10).Select(id => new ActivityAssignment
            {
                Id = Guid.NewGuid(),
                ProjectAssingnmentId = assignment.ProjectAssignmentId,
                ActivityId = id
            }).ToList();

            _context.ActivityAssignments.AddRange(assignments);
            assignment.state = "Aktivní";

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("edit-detail/{id}")]
        public async Task<IActionResult> GetEditDetail(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var assignment = await _context.ProjectAssignments
                .FirstOrDefaultAsync(pa => pa.ProjectId == id && pa.EmployeeId == userId);

            if (assignment == null)
            {
                var projectOnly = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
                return Ok(new { project = projectOnly, selectedActivityIds = new List<Guid>() });
            }

            var selectedIds = await _context.ActivityAssignments
                .Where(aa => aa.ProjectAssingnmentId == assignment.ProjectAssignmentId)
                .Select(aa => aa.ActivityId)
                .ToListAsync();

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);

            return Ok(new
            {
                project = project,
                selectedActivityIds = selectedIds
            });
        }

        [HttpPost("activity")]
        public async Task<ActionResult> CreateActivity([FromBody] CreateActivityDTO dto)
        {
            var activity = new Activity
            {
                ActivityId = Guid.NewGuid(),
                ActivityName = dto.ActivityName
            };

            _context.Activities.Add(activity);

            await _context.SaveChangesAsync();
            return Ok(activity);
        }

        [HttpGet("lookup")]
        public async Task<IActionResult> GetActivitiesLookup()
        {
            // Vrátíme seznam aktivit seřazený podle abecedy
            var activities = await _context.Activities
                .OrderBy(a => a.ActivityName)
                .Select(a => new
                {
                    a.ActivityId,
                    a.ActivityName
                })
                .ToListAsync();

            return Ok(activities);
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetProjectDetail(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var assignment = await _context.ProjectAssignments
                .FirstOrDefaultAsync(pa => pa.ProjectId == id && pa.EmployeeId == userId);

            if (assignment == null)
            {
                Console.WriteLine($"!!! DEBUG: Nenalezen ProjectAssignment pro Project:{id} a User:{userId}");
            }
            else
            {
                Console.WriteLine($"!!! DEBUG: Nalezen ProjectAssignment ID: {assignment.ProjectAssignmentId}");
            }

            if (assignment != null)
            {
                var count = await _context.ActivityAssignments
                    .CountAsync(aa => aa.ProjectAssingnmentId == assignment.ProjectAssignmentId);
                Console.WriteLine($"!!! DEBUG: V tabulce ActivityAssignments nalezeno řádků: {count}");
            }

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);

            var activityNames = await _context.ActivityAssignments
                .Where(aa => aa.ProjectAssingnmentId == assignment.ProjectAssignmentId)
                .Include(aa => aa.Activity)
                .Select(aa => aa.Activity.ActivityName)
                .ToListAsync();

            return Ok(new
            {
                project = project,
                activities = activityNames
            });
        }

        [HttpPost("cv-details")]
        public async Task<IActionResult> GetProjectsForCV([FromBody] List<Guid> selectedProjectIds)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (selectedProjectIds == null || !selectedProjectIds.Any())
                return BadRequest("Nebyly vybrány žádné projekty.");

            var projectsData = await _context.ProjectAssignments
                .Include(pa => pa.Project)
                .Include(pa => pa.ActivityAssignments)
                    .ThenInclude(aa => aa.Activity)
                .Where(pa => pa.EmployeeId == userId && selectedProjectIds.Contains(pa.ProjectId))
                .Select(pa => new
                {
                    ProjectId = pa.ProjectId,
                    ProjectName = pa.Project.Name,
                    Customer = pa.Project.Customer,
                    Description = pa.Project.Description,
                    Activities = pa.ActivityAssignments.Select(aa => aa.Activity.ActivityName).ToList()
                })
                .ToListAsync();

            return Ok(projectsData);
        }
    }
}
