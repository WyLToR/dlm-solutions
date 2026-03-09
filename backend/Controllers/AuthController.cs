using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly string _jwtKey;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _jwtKey = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Missing configuration value: Jwt:Key");
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _authService.LoginAsync(request.Username, request.Password);

        if (user == null)
            return Unauthorized(new { message = "Hibás felhasználónév vagy jelszó." });

        var response = CreateAuthResponse(user.Id, user.Username);
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
    {
        var user = await _authService.RegisterAsync(request.Username, request.Password);

        if (user == null)
            return BadRequest(new { message = "Username already exists." });

        var response = CreateAuthResponse(user.Id, user.Username);
        return Ok(response);
    }

    private LoginResponse CreateAuthResponse(int userId, string username)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return new LoginResponse
        {
            Token = jwt,
            UserId = userId,
            Username = username
        };
    }
}
