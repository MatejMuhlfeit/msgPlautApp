using Microsoft.AspNetCore.Identity;
using msgPlautDB.Models;

namespace msgPlautDB.Services
{
    public static class DbInitializer
    {
        
        
            public static async Task SeedAdminUser(UserManager<Employee> userManager, RoleManager<IdentityRole<Guid>> roleManager)
            { 
                if (!await roleManager.RoleExistsAsync("Admin"))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid> { Name = "admin"});
                }

                string adminEmail = "admin@msg-plaut.cz";
                if (await userManager.FindByEmailAsync(adminEmail) == null)
                {
                    var admin = new Employee
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        Name = "Hlavní",
                        Surname = "Admin",
                        EmailConfirmed = true,
                        City = "none",
                        Country = "none",
                        BirthYear = 0,
                        EmploymentType = "admin",
                        Position = "admin",
                        Role = "Admin"
                    };

                    var result = await userManager.CreateAsync(admin, "AdminHeslo123!");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(admin, "Admin");
                    }
                }
            }
    }
}
