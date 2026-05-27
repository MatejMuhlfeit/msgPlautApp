using System.Text.Json.Serialization;

namespace msgPlautDB.Models
{
    public class EmployeeEducation
    {
        public Guid Id { get; set; }
        public required string InstitutionName { get; set; }
        public required string Degree { get; set; }
        public required string FieldOfStudy { get; set; }
        public int? GraduationYear { get; set; }
        public bool isCurrent { get; set; }

        public Guid EmployeeId { get; set; }
        [JsonIgnore]
        public virtual Employee? Employee { get; set; }
    }
}
