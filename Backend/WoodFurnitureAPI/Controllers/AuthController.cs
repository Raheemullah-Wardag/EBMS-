using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
 
    public AuthController(AuthService authService)
    {
        _authService = authService;
    }
 
    // POST /api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var result = _authService.Login(dto);
        if (result == null)
            return Unauthorized(new { message = "Invalid username or password." });
 
        return Ok(result);
    }
 
    // POST /api/auth/register
    [HttpPost("register")]
    [AllowAnonymous]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        var (success, message) = _authService.Register(dto);
        if (!success)
            return BadRequest(new { message });
 
        return Ok(new { message });
    }
}
 