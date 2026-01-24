using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Identity;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthController(ApplicationDbContext context, IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Dictionary<string, string> data)
    {
        // Check if null
        if (data == null || !data.TryGetValue("username", out string? username) || !data.TryGetValue("password", out string? password))
        {
            return BadRequest(new
            {
                message = "Username and password are required"
            });
        }
        
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return BadRequest(new
            {
                message = "Username and password cannot be empty"
            });
        
        if (await _context.Users.AnyAsync(u => u.Username == username))
            return BadRequest(new
            {
                message = "User already exists!"
            });
        
        var user = new User
        {
            Username = username,
            PasswordHash = _passwordHasher.HashPassword(new User { Username = username }, password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Registration successful!",
            userId = user.Id
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Dictionary<string, string> data)
    {
        // Check if null
        if (data == null || !data.TryGetValue("username", out string? username) || !data.TryGetValue("password", out string? password))
            return Unauthorized(new
            {
                message = "Username and password are required"
            });
        
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return Unauthorized(new { message = "Username and password cannot be empty" });
        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return Unauthorized(new { message = "Wrong credentials!" });

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password
        );

        if (result != PasswordVerificationResult.Success)
            return Unauthorized(new { message = "Wrong credentials!" });

        return Ok(new
        {
            message = "Login successful!",
            userId = user.Id,
            username = user.Username
        });
    }

    [HttpGet("check/{username}")]
    public async Task<IActionResult> CheckUser(string username)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == username);
        return Ok(new { exists });
    }
}