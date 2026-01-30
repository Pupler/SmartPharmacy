using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddMedication([FromBody] Dictionary<string, string> data)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            int userId = int.Parse(userIdClaims);

            if (data == null || !data.TryGetValue("name", out string? name))
            {
                return BadRequest(new
                {
                    message = "Name of a medication is required"
                });
            }

            var medication = new Medication
            {
                Name = name,
                Dosage = null,
                Notes = null,
                UserId = userId
            };

            _context.Medications.Add(medication);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "ALLES GUT!"
            });
        }
    }
}