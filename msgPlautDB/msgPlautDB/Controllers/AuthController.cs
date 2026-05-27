using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using msgPlautDB.DTOs;
using msgPlautDB.Services;

namespace msgPlautDB.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService _authservice)
        {
            _authService = _authservice;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            var result = await _authService.RegisterAsync(registerDTO);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors });
            }
            return Ok(new { token = result.Token, user = result.User });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var result = await _authService.LoginAsync(loginDTO);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors });
            }
            return Ok(new {
                token = result.Token, 
                role = result.User?.Role,
                name = result.User?.Name,
                email = result.User?.Email,
            
            });
        }
    }
}
