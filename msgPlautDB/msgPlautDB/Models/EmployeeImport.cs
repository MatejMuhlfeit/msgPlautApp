using Microsoft.AspNetCore.Identity;

namespace msgPlautDB.Models
{
    public class EmployeeImport
    {
        public int Id { get; set; } // odpovídá 'id' (int) v phpMyAdminu
        public string Name { get; set; } = null!; // firstname
        public string Surname { get; set; } = null!; // lastname
        public string? City { get; set; }
        public string? Username { get; set; }
        public string CostCenter { get; set; } = null!;

        // Spojení na mapovací tabulku
        public virtual EmployeeMapping? Mapping { get; set; }
    }
}
