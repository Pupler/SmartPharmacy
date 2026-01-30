using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Medication
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(50)]
        public string? Dosage { get; set; }

        [StringLength(200)]
        public string? Notes { get; set; }
    }
}