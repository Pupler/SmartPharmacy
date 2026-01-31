using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationsController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medication>>> GetMedications()
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaims == null)
            {
                return BadRequest(new
                {
                    message = "Unauthorized"
                });
            }

            int userId = int.Parse(userIdClaims);

            return await _context.Medications.Where(m => m.UserId == userId).ToListAsync();
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddMedication([FromBody] Dictionary<string, string> data)
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaims == null)
            {
                return Unauthorized(new
                {
                    message = "Unauthorized"
                });
            }

            int userId = int.Parse(userIdClaims);

            string name = data["name"];
            string dosage = data["dosage"];
            string notes = data["notes"];

            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new
                {
                    message = "Name of a medication is required"
                });
            }

            var medication = new Medication
            {
                Name = name,
                Dosage = dosage,
                Notes = notes,
                UserId = userId
            };

            _context.Medications.Add(medication);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Medication {name} added!"
            });
        }
    }
}