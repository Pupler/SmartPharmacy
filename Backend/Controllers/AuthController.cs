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

    [HttpGet("register")]
    public async Task<IActionResult> Register(string username, string password)
    {
        if (await _context.Users.AnyAsync(u => u.Username == username))
        {
            return BadRequest(new
            {
                message = "User already exists!"
            });
        }
        
        var user = new User
        {
            Username = username,
            PasswordHash = _passwordHasher.HashPassword(new User { Username = username }, password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Registration successsful!",
            userId = user.Id
        });
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
        {
            return Unauthorized(new
            {
               message = "Wrong credentials!" 
            });
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password
        );

        if (user == null || result != PasswordVerificationResult.Success)
        {
            return Unauthorized(new
            {
                message = "Wrong password or username!"
            });
        }

        return Ok(new
        {
            message = "Login successsful!",
            userId = user.Id,
            username = user.Username
        });
    }

    [HttpGet("check/{username}")]
    public async Task<IActionResult> CheckUser(string username)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == username);

        return Ok (new {
            exists
        });
    }
}