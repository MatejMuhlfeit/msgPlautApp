using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace msgPlautDB.Models
{
    public class EmployeeExpertise
    {
        public Guid Id { get; set; }
        public required string ExpertiseName { get; set; }
        
        public Guid ExpertiseAreaId { get; set; }
        [ForeignKey("ExpertiseAreaId")]
        public EmployeeExpertiseArea? EmployeeExpertiseArea { get; set; }

        public Guid EmployeeId { get; set; }
        [JsonIgnore]
        public virtual Employee? Employee { get; set; }
    }
}
