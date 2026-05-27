namespace msgPlautDB.DTOs
{
    public class EmployeeBasicInfoDTO
    {
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required string Position { get; set; }
        public required string EmploymentType { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public required int BirthYear { get; set; }
    }
}
