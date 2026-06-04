using System.ComponentModel.DataAnnotations;
using Systen.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace msgPlautDB.Models
{
    public class Employee : IdentityUser<Guid>
    {
        [NotMapped] // Řekne EF Core, aby pro toto nevytvářel sloupec v tabulce Employees
        public string Name 
        {
            get => Mapping?.EmployeeImport?.Name ?? string.Empty;
            set 
            {
                if (Mapping == null) Mapping = new EmployeeMapping();
                if (Mapping.EmployeeImport == null) Mapping.EmployeeImport = new EmployeeImport();
                Mapping.EmployeeImport.Name = value;
            }
        }   
        [NotMapped]
        public string Surname 
        {
            get => Mapping?.EmployeeImport?.Surname ?? string.Empty;
            set 
            {
                if (Mapping == null) Mapping = new EmployeeMapping();
                if (Mapping.EmployeeImport == null) Mapping.EmployeeImport = new EmployeeImport();
                Mapping.EmployeeImport.Surname = value;
            }
        }
        [NotMapped]
        public string City 
        {
            get => Mapping?.EmployeeImport?.City ?? string.Empty;
            set 
            {
                if (Mapping == null) Mapping = new EmployeeMapping();
                if (Mapping.EmployeeImport == null) Mapping.EmployeeImport = new EmployeeImport();
                Mapping.EmployeeImport.City = value;
            }
        }
        [NotMapped]
        public string CostCenter
        {
            get => Mapping?.EmployeeImport?.CostCenter ?? string.Empty;
            set
            {
                if (Mapping == null) Mapping = new EmployeeMapping();
                if (Mapping.EmployeeImport == null) Mapping.EmployeeImport = new EmployeeImport();
                Mapping.EmployeeImport.CostCenter = value;
            }
        }
    
        public override string Email => Mapping?.EmployeeImport?.Email ?? string.Empty;
        public required string Position { get; set; }
        public required string EmploymentType { get; set; }
        public required string Country { get; set; }
        public required int BirthYear { get; set; }
        public required string Role { get; set; } = "User";

        // Spojení na mapovací tabulku
        public virtual EmployeeMapping? Mapping { get; set; }

        // Tvoje stávající kolekce zůstávají beze změny spojené přes Guid
        public virtual ICollection<EmployeeExpertise> Expertises { get; set; } = new List<EmployeeExpertise>();
        public virtual ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
        public virtual ICollection<EmployeeEducation> Educations { get; set; } = new List<EmployeeEducation>();
        public virtual ICollection<EmployeeLanguage> Languages { get; set; } = new List<EmployeeLanguage>();
        public virtual ICollection<ProjectAssignment>? ProjectsAssignments { get; set; } = new List<ProjectAssignment>();
    }
}
