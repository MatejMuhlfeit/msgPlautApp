namespace msgPlautDB.DTOs
{
    public class ProjectListDTO
    {
        public Guid ProjectId { get; set; }
        public string Name { get; set; }
        public string AssignmentState { get; set; }
        public string StartTime { get; set; }
        public string? EndTime { get; set; }
        public string AssignedState { get; set; }
    }
}
