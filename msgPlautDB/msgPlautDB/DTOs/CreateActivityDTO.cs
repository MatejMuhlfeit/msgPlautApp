namespace msgPlautDB.DTOs
{
    public class CreateActivityDTO
    {
        public Guid ActivityId { get; set; }
        public required string ActivityName { get; set; }
    }
}
