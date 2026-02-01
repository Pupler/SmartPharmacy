using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        public string? Description { get; set; }

        public string? DoctorName { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }
    }
}