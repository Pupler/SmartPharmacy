using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string? Username { get; set; }

        [Required]
        [StringLength(500)]
        public string? PasswordHash { get; set; }
    }
}