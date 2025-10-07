using ContentHub.Data;
using ContentHub.Models;

namespace ContentHub.Data;

public static class DataSeeder
{
    public static void Seed(ApiDbContext context, IConfiguration configuration)
    {
        
        if (!context.Users.Any())
        {
            var username = configuration["DefaultUser:Username"];
            var password = configuration["DefaultUser:Password"];
            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password) 
            };

            context.Users.Add(user);
            context.SaveChanges();
        }
    }
}