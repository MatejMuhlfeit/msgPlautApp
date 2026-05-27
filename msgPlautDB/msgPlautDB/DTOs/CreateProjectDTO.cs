namespace msgPlautDB.DTOs
{
    public class CreateProjectDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Customer { get; set; }
        public string Location { get; set; }
        public string UniqueKey { get; set; }
        public string Language { get; set; }
        public string Branch { get; set; }
        public string StartTime { get; set; }
        public List<Guid> AssignedEmployeeIds { get; set; } = new List<Guid>();
    }
}
