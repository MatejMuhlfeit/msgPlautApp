using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using msgPlautDB.Models;
using System.Reflection.Emit;

namespace msgPlautDB.Data

{
    // Tady se vracíme k původnímu IdentityDbContext s tvým Employee a Guid
    public class ApplicationDbContext : IdentityDbContext<Employee, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> option) : base(option)
        {

        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeImport> EmployeeImports { get; set; }
        public DbSet<EmployeeMapping> EmployeeMappings { get; set; }
        public DbSet<EmployeeEducation> EmployeeEducations { get; set; }
        public DbSet<EmployeeExpertise> EmployeeExpertises { get; set; }
        public DbSet<EmployeeExpertiseArea> EmployeeExpertiseAreas { get; set; }
        public DbSet<EmployeeLanguage> EmployeeLanguages { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectAssignment> ProjectAssignments { get; set; }
        public DbSet<ActivityAssignment> ActivityAssignments { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // 1. FIREMNÍ TABULKA (Pouze pro čtení, exclude z migrací)
            builder.Entity<EmployeeImport>(entity =>
            {
                entity.ToTable("admins", t => t.ExcludeFromMigrations());
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name).HasColumnName("firstname");
                entity.Property(e => e.Surname).HasColumnName("lastname");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.Email).HasColumnName("email"); // pokud tam je sloupec email
            });

            // 2. MAPOVACÍ TABULKA (Tato se v DB normálně vytvoří)
            builder.Entity<EmployeeMapping>(entity =>
            {
                entity.ToTable("EmployeeMappings");

                // Složený nebo primární klíč postavíme na tvém EmployeeId (Guid)
                entity.HasKey(e => e.EmployeeId);

                // Vztah 1:1 na tvého Employee (Guid)
                entity.HasOne(em => em.Employee)
                      .WithOne(e => e.Mapping)
                      .HasForeignKey<EmployeeMapping>(em => em.EmployeeId);

                // Vztah 1:1 na firemní EmployeeImport (int)
                entity.HasOne(em => em.EmployeeImport)
                      .WithOne(ei => ei.Mapping)
                      .HasForeignKey<EmployeeMapping>(em => em.FiremniAdminId);
            });
        }
    }
}
