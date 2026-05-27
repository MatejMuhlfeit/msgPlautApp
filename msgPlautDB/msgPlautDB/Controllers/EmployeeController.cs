using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using msgPlautDB.Data;
using msgPlautDB.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace msgPlautDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly ApplicationDbContext dbContext;
        public EmployeeController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("lookup")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<EmployeeLookupDTO>>> GetEmployeeLookup()
        {
            return await dbContext.Employees.Select(e => new EmployeeLookupDTO
            {
                Id = e.Id,
                FullName = $"{e.Name} {e.Surname}",
                Position = e.Position
            })
                .ToListAsync();
        }
    }
}
