namespace msgPlautDB.DTOs
{
    public class ProjectActivationDTO
    {
            public Guid ProjectId { get; set; }
            public List<Guid> SelectedActivities { get; set; } = new List<Guid>();
    }
}
