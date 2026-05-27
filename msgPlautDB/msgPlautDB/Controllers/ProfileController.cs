using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using msgPlautDB.Data;
using System.Security.Claims;
using msgPlautDB.Models;
using msgPlautDB.DTOs;


namespace msgPlautDB.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ProfileController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var employee = await _dbContext.Employees
                .Include(e => e.Languages)
                .Include(e => e.Expertises)
                    .ThenInclude(e => e.EmployeeExpertiseArea)
                .Include(e => e.WorkExperiences)
                .Include(e => e.Educations)
                .FirstOrDefaultAsync(e => e.Id == userId);

            if (employee == null) return NotFound("Uživatel nenalezen");

            return Ok(employee);
        }
        [HttpGet("expertise-areas")]
        public async Task<ActionResult<IEnumerable<object>>> GetAreas()
        {
            return await _dbContext.EmployeeExpertiseAreas
                .Select(a => new { a.Id, a.ExpertiseAreaName })
                .ToListAsync();
        }
        [HttpPost("expertise-areas")]
        public async Task<ActionResult> AddArea(EmployeeExpertiseAreaDTO dto)
        {
            var ExpertiseArea = new EmployeeExpertiseArea
            {
                Id = Guid.NewGuid(),
                ExpertiseAreaName = dto.ExpertiseAreaName,

            };
            _dbContext.EmployeeExpertiseAreas.Add(ExpertiseArea);
                await _dbContext.SaveChangesAsync();
            return Ok(ExpertiseArea);
        }

        [HttpPost("languages")]
        public async Task<IActionResult> AddLanguage(EmployeeLanguageDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var language = new EmployeeLanguage
            {
                Id = Guid.NewGuid(),
                EmployeeId = userId,
                LanguageName = dto.LanguageName,
                Level = dto.Level
            };

            _dbContext.EmployeeLanguages.Add(language);
            await _dbContext.SaveChangesAsync();

            return Ok(language);
        }

        [HttpPost("work-experiences")]
        public async Task<IActionResult> AddWorkExperience(WorkExperienceDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var experience = new WorkExperience
            {
                Id = Guid.NewGuid(),
                EmployeeId = userId,
                CompanyName = dto.CompanyName,
                Position = dto.Position,
                StartYear = dto.StartYear,
                WorkActivities = dto.WorkActivities,
                EndYear = dto.IsCurrent ? null : dto.EndYear,

            };
            _dbContext.WorkExperiences.Add(experience);
            await _dbContext.SaveChangesAsync();
            return Ok(experience);

        }

        [HttpPost("educations")]
        public async Task<IActionResult> AddEducation(EmployeeEducationDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var education = new EmployeeEducation
            {
                Id = Guid.NewGuid(),
                EmployeeId = userId,
                InstitutionName = dto.InstitutionName,
                Degree = dto.Degree,
                FieldOfStudy = dto.FieldOfStudy,
                GraduationYear = dto.GraduationYear,
            };
            _dbContext.EmployeeEducations.Add(education);
            await _dbContext.SaveChangesAsync();
            return Ok(education);
        }

        [HttpPost("expertises")]
        public async Task<ActionResult<EmployeeExpertiseDTO>> AddExpertise(EmployeeExpertiseDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var expertise = new EmployeeExpertise
            {
                Id = Guid.NewGuid(),
                ExpertiseName = dto.ExpertiseName,
                ExpertiseAreaId = dto.ExpertiseAreaId,
                EmployeeId = userId
            };

            _dbContext.EmployeeExpertises.Add(expertise);
            await _dbContext.SaveChangesAsync();

            var savedExpertise = await _dbContext.EmployeeExpertises
                .Include(e => e.EmployeeExpertiseArea)
                .FirstOrDefaultAsync(e => e.Id == expertise.Id);

            if (savedExpertise == null) return NotFound();

            return Ok(new EmployeeExpertiseDTO
            {
                Id = savedExpertise.Id,
                ExpertiseName = savedExpertise.ExpertiseName,
                ExpertiseAreaId = savedExpertise.ExpertiseAreaId,
                ExpertiseAreaName = savedExpertise.EmployeeExpertiseArea?.ExpertiseAreaName
            });
        }
        [HttpPut("basic-info")]
        public async Task<IActionResult> UpdateBasicInfo(EmployeeBasicInfoDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var employee = await _dbContext.Employees.FindAsync(userId);
            if (employee == null) return NotFound("Uživatel nenalezen");
            employee.Name = dto.Name;
            employee.Surname = dto.Surname;
            employee.Position = dto.Position;
            employee.EmploymentType = dto.EmploymentType;
            employee.City = dto.City;
            employee.Country = dto.Country;
            employee.BirthYear = dto.BirthYear;
            await _dbContext.SaveChangesAsync();
            return Ok(employee);

        }

        [HttpPut("work-experiences/{id}")]
        public async Task<IActionResult> UpdateWorkExperience(Guid id, WorkExperienceDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var experience = await _dbContext.WorkExperiences.FirstOrDefaultAsync(e => e.Id == id && e.EmployeeId == userId);
            if (experience == null) return NotFound("Pracovní zkušenost nenalezena");
            experience.CompanyName = dto.CompanyName;
            experience.Position = dto.Position;
            experience.StartYear = dto.StartYear;
            experience.WorkActivities = dto.WorkActivities;
            experience.EndYear = dto.IsCurrent ? null : dto.EndYear;
            await _dbContext.SaveChangesAsync();
            return Ok(experience);
        }

        [HttpPut("educations/{id}")]
        public async Task<IActionResult> UpdateEducation(Guid id, EmployeeEducationDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var education = await _dbContext.EmployeeEducations.FirstOrDefaultAsync(e => e.Id == id && e.EmployeeId == userId);
            if (education == null) return NotFound("Vzdělání nenalezeno");
            education.InstitutionName = dto.InstitutionName;
            education.Degree = dto.Degree;
            education.FieldOfStudy = dto.FieldOfStudy;
            education.GraduationYear = dto.isCurrent ? null : dto.GraduationYear;
            await _dbContext.SaveChangesAsync();
            return Ok(education);
        }

        [HttpPut("languages/{id}")]
        public async Task<IActionResult> UpdateLanguage(Guid id, EmployeeLanguageDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var language = await _dbContext.EmployeeLanguages.FirstOrDefaultAsync(l => l.Id == id && l.EmployeeId == userId);
            if (language == null) return NotFound("Jazyk nenalezen");
            language.LanguageName = dto.LanguageName;
            language.Level = dto.Level;
            await _dbContext.SaveChangesAsync();
            return Ok(language);
        }
        [HttpPut("expertise-areas/{id}")]
        public async Task<IActionResult> UpdateExpertiseArea(Guid id, EmployeeExpertiseAreaDTO dto)
        {
            var ExpertiseArea = await _dbContext.EmployeeExpertiseAreas.FirstOrDefaultAsync(e => e.Id == id);
            if (ExpertiseArea == null) return NotFound("Oblast nenalezena");
            ExpertiseArea.ExpertiseAreaName = dto.ExpertiseAreaName;
            await _dbContext.SaveChangesAsync();
            return Ok(ExpertiseArea);
        }

        [HttpPut("expertises/{id}")]
        public async Task<IActionResult> UpdateExpertise(Guid id, EmployeeExpertiseDTO dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var expertise = await _dbContext.EmployeeExpertises.FirstOrDefaultAsync(e => e.Id == id && e.EmployeeId == userId);
            if (expertise == null) return NotFound("Odbornost nenalezena");
            expertise.ExpertiseName = dto.ExpertiseName;
            await _dbContext.SaveChangesAsync();
            return Ok(expertise);
        }

        [HttpDelete("expertises/{id}")]
        public async Task<IActionResult> DeleteExpertise(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var expertise = await _dbContext.EmployeeExpertises.FirstOrDefaultAsync(e => e.Id == id && e.EmployeeId == userId);
            if (expertise == null) return NotFound("Odbornost nenalezena");
            _dbContext.EmployeeExpertises.Remove(expertise);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("educations/{id}")]
        public async Task<IActionResult> DeleteEducation(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var education = await _dbContext.EmployeeEducations.FirstOrDefaultAsync(e => e.Id == id && e.EmployeeId == userId);
            if (education == null) return NotFound("Vzdělání nenalezeno");
            _dbContext.EmployeeEducations.Remove(education);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("languages/{id}")]
        public async Task<IActionResult> DeleteLanguage(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var language = await _dbContext.EmployeeLanguages.FirstOrDefaultAsync(l => l.Id == id && l.EmployeeId == userId);
            if (language == null) return NotFound("Jazyk nenalezen");
            _dbContext.EmployeeLanguages.Remove(language);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("work-experiences/{id}")]
        public async Task<IActionResult> DeleteWorkExperience(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var experience = await _dbContext.WorkExperiences.FirstOrDefaultAsync(e => e.Id == id && e.EmployeeId == userId);
            if (experience == null) return NotFound("Pracovní zkušenost nenalezena");
            _dbContext.WorkExperiences.Remove(experience);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("expertise-areas/{id}")]
        public async Task<IActionResult> DeleteExpertiseArea(Guid id)
        {
            var ExpertiseArea = await _dbContext.EmployeeExpertiseAreas.FirstOrDefaultAsync(e => e.Id == id);
            if (ExpertiseArea == null) return NotFound("Oblast nenalezena");
            _dbContext.EmployeeExpertiseAreas.Remove(ExpertiseArea);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

    }
}