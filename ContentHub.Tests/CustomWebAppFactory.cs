using ContentHub.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Xunit;
using System.Threading.Tasks;

// Remova as referências do SQLite
// using System.Data.Common;
// using Microsoft.Data.Sqlite;

namespace ContentHub.Tests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly string _testConnectionString = "Host=localhost;Database=contenthub_test_db;Username=contenthub_user;Password=uma_senha_forte_aqui";

    public CustomWebApplicationFactory()
    {
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApiDbContext>));

            if (dbContextDescriptor != null)
            {
                services.Remove(dbContextDescriptor);
            }

            services.AddDbContext<ApiDbContext>(options =>
            {
                options.UseNpgsql(_testConnectionString);
            });
        });

        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "UMA_CHAVE_SECRETA_LONGA_O_SUFICIENTE_PARA_TESTES_COM_256_BITS",
                ["Jwt:Issuer"] = "https://localhost",
                ["Jwt:Audience"] = "https://localhost",
                ["DefaultUser:Username"] = "test",
                ["DefaultUser:Password"] = "password123"
            });
        });

        builder.UseEnvironment("Development");
    }

    public async Task InitializeAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
        
        await context.Database.EnsureCreatedAsync(); 
    }

    public new async Task DisposeAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApiDbContext>();

        await context.Database.EnsureDeletedAsync(); 
        
        await base.DisposeAsync();
    }
    
    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
    }
}