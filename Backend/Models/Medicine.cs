using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Medicine
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string? Name { get; set; }

        [Required]
        [Range(0.01, 99999)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, 10000)]
        public int Stock { get; set; }

        [Required]
        public bool RequiresPrescription { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}