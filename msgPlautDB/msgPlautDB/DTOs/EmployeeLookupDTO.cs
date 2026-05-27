using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace msgPlautDB.DTOs
{
    public class EmployeeLookupDTO
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Position { get; set; }
    }
}
