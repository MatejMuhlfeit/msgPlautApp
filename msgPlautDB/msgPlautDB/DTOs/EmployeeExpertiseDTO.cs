namespace msgPlautDB.DTOs
{
    public class EmployeeExpertiseDTO
    {
        public Guid Id { get; set; }
        public required string ExpertiseName { get; set; } 

        public Guid ExpertiseAreaId { get; set; }
        public string? ExpertiseAreaName { get; set; }
    }
}
