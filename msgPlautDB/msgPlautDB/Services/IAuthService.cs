using msgPlautDB.Models;
using msgPlautDB.DTOs;

namespace msgPlautDB.Services
{
    public interface IAuthService
    {
        Task<(bool Succeeded, string[] Errors, string Token, Employee? User)> RegisterAsync(RegisterDTO registerDTO);
        Task<(bool Succeeded, string[] Errors, string Token, Employee? User)> LoginAsync(LoginDTO loginDTO);
    }
}
