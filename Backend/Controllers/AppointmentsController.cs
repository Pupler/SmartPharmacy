using System.Security.Claims;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
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

            return await _context.Appointments.Where(a => a.UserId == userId).ToListAsync();
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddAppointment([FromBody] Dictionary<string, string> data)
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

            string desc = data["desc"];
            string doctorName = data["docName"];
            string appointmentDate = data["date"];

            if (string.IsNullOrWhiteSpace(desc) || string.IsNullOrWhiteSpace(appointmentDate))
            {
                return BadRequest(new
                {
                    message = "Description and appointment date are required"
                });
            }

            if (!DateTime.TryParse(appointmentDate, out DateTime appDate))
            {
                return BadRequest(new
                {
                    message = "Invalid format for appointment date!"
                });
            }

            var appointment = new Appointment
            {
                Description = desc,
                DoctorName = doctorName,
                AppointmentDate = appDate,
                UserId = userId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Appointment {desc} added"
            });
        }
    }
}