using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace msgPlautDB.Models
{
    public class Employee : IdentityUser<Guid>
    {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string Position { get; set; }
        public required string EmploymentType { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public required int BirthYear { get; set; }
        public required string Role { get; set; } = "User";

        public virtual ICollection<EmployeeExpertise> Expertises { get; set; } = new List<EmployeeExpertise>();
        public virtual ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
        public virtual ICollection<EmployeeEducation> Educations { get; set; } = new List<EmployeeEducation>();
        public virtual ICollection<EmployeeLanguage> Languages { get; set; } = new List<EmployeeLanguage>();
        public virtual ICollection<ProjectAssignment>? ProjectsAssignments { get; set; } = new List<ProjectAssignment>();
    }
}
