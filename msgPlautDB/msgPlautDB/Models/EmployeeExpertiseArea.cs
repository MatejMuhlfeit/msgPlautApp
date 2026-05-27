using System.Text.Json.Serialization;

namespace msgPlautDB.Models
{
    public class EmployeeExpertiseArea
    {
        public Guid Id { get; set; }
        public required string ExpertiseAreaName { get; set; }
    }
}
