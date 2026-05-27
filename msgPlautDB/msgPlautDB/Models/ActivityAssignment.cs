using System.ComponentModel.DataAnnotations;


namespace msgPlautDB.Models

{
    public class ActivityAssignment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProjectAssingnmentId { get; set; }
        public virtual ProjectAssignment? ProjectAssignment { get; set; }

        public Guid ActivityId { get; set; }
        public virtual Activity? Activity { get; set; }
    }
}
