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
    }
}