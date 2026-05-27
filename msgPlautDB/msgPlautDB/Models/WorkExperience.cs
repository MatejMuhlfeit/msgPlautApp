using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Text.Json.Serialization;

namespace msgPlautDB.Models
{
    public class WorkExperience
    {
        public Guid Id { get; set; }
        public required string CompanyName { get; set; }
        public required string Position { get; set; }
        public required string WorkActivities { get; set; }
        public required int StartYear { get; set; }
        public int? EndYear { get; set; }

        public Guid EmployeeId { get; set; }
        [JsonIgnore]
        public virtual Employee? Employee { get; set; }
    }
}
