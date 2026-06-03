namespace msgPlautDB.Models
{
    public class EmployeeMapping
    {
        // Primární klíč pro tvou stranu (Guid)
        public Guid EmployeeId { get; set; }
        public virtual Employee Employee { get; set; } = null!;

        // Cizí klíč pro firemní stranu (int)
        public int FiremniAdminId { get; set; }
        public virtual EmployeeImport EmployeeImport { get; set; } = null!;
    }
}
