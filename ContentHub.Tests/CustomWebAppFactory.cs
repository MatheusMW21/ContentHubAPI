using System.Data.Common;
using ContentHub.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Xunit;
using System.Threading.Tasks;


namespace ContentHub.Tests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly SqliteConnection _connection;

    public CustomWebApplicationFactory()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
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
                options.UseSqlite(_connection);
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

    public override async ValueTask DisposeAsync()
    {
        await _connection.CloseAsync();
        await base.DisposeAsync();
    }
    
    async Task IAsyncLifetime.DisposeAsync()
    {
        await DisposeAsync();
    }

    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApiDbContext>();
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
    }

}