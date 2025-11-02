using ContentHub.Data;
using ContentHub.Dtos;
using ContentHub.Models;
using ContentHub.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApiDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(ApiDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return BadRequest("Nome de usuário e senha são obrigatórios.");
            }

            if (registerDto.Username.Contains(" "))
            {
                return BadRequest("Nome de usuário não pode conter espaços.");
            }
            
            var existingUser = await _context.Users
                .AnyAsync(u => u.Username.ToLower() == registerDto.Username.ToLower());

            if (existingUser)
            {
                return BadRequest("Nome de usuário já está em uso.");
            }

            if (registerDto.Password != registerDto.PasswordConfirmation)
            {
                return BadRequest("A confirmação de senha não corresponde à senha.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Username = registerDto.Username,
                PasswordHash = passwordHash
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == loginDto.Username.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Credenciais inválidas.");
            }

            var token = _tokenService.GenerateToken(user);

            return Ok(new { token });
        }
    }
}
