using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using ContentHub.Data;
using ContentHub.Dtos;
using ContentHub.Models;
using ContentHub.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ContentHub.Tests.Controllers;

public class LinksControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public LinksControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAllLinks_WithoutToken_ShouldReturnUnauthorized()
    {
        var response = await _client.GetAsync("/api/links");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAllLinks_WithValidToken_ShouldReturnSuccessAndUserLinksOnly()
    {
        await _factory.ResetDatabaseAsync();

        string token;
        User userFromDb;

        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApiDbContext>();

            var user1 = new User { Username = "testuser", PasswordHash = "hash1" };
            var user2 = new User { Username = "anotheruser", PasswordHash = "hash2" };
            context.Users.AddRange(user1, user2);
            await context.SaveChangesAsync(); 

            userFromDb = user1;

            context.Links.Add(new SavedLink { Url = "http://test.com", User = user1 });
            context.Links.Add(new SavedLink { Url = "http://othertest.com", User = user2 });
            await context.SaveChangesAsync();
        }

        using (var scope = _factory.Services.CreateScope())
        {
            var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();
            token = tokenService.GenerateToken(userFromDb);
        }

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/api/links");

        response.EnsureSuccessStatusCode();

        var links = await response.Content.ReadFromJsonAsync<List<LinkDto>>();

        Assert.NotNull(links);
        Assert.Single(links); 
        Assert.Equal("http://test.com", links[0].Url);
        Assert.Equal(userFromDb.Id, links[0].Id); 
    }
}