using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Text.Json.Serialization;

namespace msgPlautDB.DTOs
{
    public class EmployeeEducationDTO
    {
        public required string InstitutionName { get; set; }
        public required string Degree { get; set; }
        public required string FieldOfStudy { get; set; }
        public int? GraduationYear { get; set; }
        public bool isCurrent { get; set; }
    }
}
