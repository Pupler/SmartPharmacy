using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("register")]
    public async Task<IActionResult> Register(string username, string password)
    {
        if (await _context.Users.AnyAsync(u => u.Username == username))
        {
            return BadRequest("User already exists!");
        }
        
        var user = new User
        {
            Username = username,
            Password = password
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Registration successsfull!",
            userId = user.Id
        });
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null || user.Password != password)
        {
            return Unauthorized("Wrong password or username!");
        }

        return Ok(new
        {
            message = "Login successsfull!",
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