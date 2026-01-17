using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        // DbSet - represents a table in a database
        public DbSet<Medicine> Medicines { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration of model Medicine
            modelBuilder.Entity<Medicine>(entity =>
            {
                // Key
                entity.HasKey(e => e.Id);
                
                // Autoincrement for MySQL
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();
                
                // Settings for Name
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
                
                // Settings for Price
                entity.Property(e => e.Price)
                    .IsRequired()
                    .HasColumnType("decimal(10,2)"); // MySQL type
                
                // Settings for Stock
                entity.Property(e => e.Stock)
                    .IsRequired()
                    .HasDefaultValue(0); // Value by default
                
                // Settings for RequiresPrescription
                entity.Property(e => e.RequiresPrescription)
                    .IsRequired()
                    .HasDefaultValue(false);

                // Settings for Category
                entity.Property(e => e.Category)
                    .HasDefaultValue("Other");
                
                // Setting for Description
                entity.Property(e => e.Description)
                    .HasDefaultValue("No description");
                
                // Value by default for CreatedAt
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }

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