namespace msgPlautDB.DTOs
{
    public class WorkExperienceDTO
    {
        public required string CompanyName { get; set; }
        public required string Position { get; set; }
        public required int StartYear { get; set; }
        public int? EndYear { get; set; }
        public bool IsCurrent { get; set; }
        public required string WorkActivities { get; set; }

    }
}
