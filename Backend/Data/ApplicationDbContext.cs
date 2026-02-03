using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        // DbSet - represents a table in a database
        public DbSet<Medicine> Medicines { get; set; } = null!;
        
        public DbSet<User> Users { get; set; } = null!;

        public DbSet<Medication> Medications { get; set; } = null!;

        public DbSet<Appointment> Appointments { get; set; } = null!;

        public bool CanConnect()
        {
            try
            {
                return Database.CanConnect();
            }
            catch
            {
                return false;
            }
        }
    }
}