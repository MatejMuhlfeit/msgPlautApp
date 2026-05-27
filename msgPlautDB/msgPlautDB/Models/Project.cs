using System.ComponentModel.DataAnnotations;

namespace msgPlautDB.Models
{
    public class Project
    {
        [Key]
        public Guid ProjectId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Customer { get; set; }
        public required string Location { get; set; }
        public required string UniqueKey { get; set; }
        public required string Language { get; set; }
        public required string Branch { get; set; }
        public required string StartTime { get; set; }
        public string? EndTime { get; set; } = null;
        public virtual ICollection<ProjectAssignment>? EmployeeAssignments { get; set; }

    }
}
