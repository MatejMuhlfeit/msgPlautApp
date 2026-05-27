using System.Text.Json.Serialization;

namespace msgPlautDB.Models
{
    public class EmployeeLanguage
    {
        public Guid Id { get; set; }
        public required string LanguageName { get; set; } 
        public required string Level { get; set; } 
        public Guid EmployeeId { get; set; }
        [JsonIgnore] 
        public virtual Employee? Employee { get; set; }
    }
}
