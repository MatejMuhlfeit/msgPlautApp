namespace msgPlautDB.Models
{
    public class ProjectAssignment
    {
        public Guid ProjectAssignmentId { get; set; } = Guid.NewGuid();

        public string state { get; set; } = "Nový";


        public Guid EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }
        public Guid ProjectId { get; set; }
        public virtual Project? Project { get; set; } 

        public virtual ICollection<ActivityAssignment>? ActivityAssignments { get; set; }
    }
}
