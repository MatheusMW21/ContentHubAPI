using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ContentHub.Models;
using ContentHub.Services;
using Microsoft.Extensions.Configuration;
using Moq;

namespace ContentHub.Tests.Services;

public class TokenServiceTests
{
    [Fact]
    public void GenerateToken_WithValidUser_ShouldReturnValidJwtWithCorrectClaims()
    {
        var mockConfiguration = new Mock<IConfiguration>();
        
        mockConfiguration.Setup(c => c["Jwt:Key"]).Returns("CHAVE_SECRETA_TESTES_12345678910");
        mockConfiguration.Setup(c => c["Jwt:Issuer"]).Returns("https://test.com");
        mockConfiguration.Setup(c => c["Jwt:Audience"]).Returns("https://test.com");

        var user = new User
        {
            Id = 1,
            Username = "testuser"
        };

        var tokenService = new TokenService(mockConfiguration.Object);

        var tokenString = tokenService.GenerateToken(user);

        Assert.NotNull(tokenString);
        Assert.NotEmpty(tokenString);

        var handler = new JwtSecurityTokenHandler();
        var decodedToken = handler.ReadJwtToken(tokenString);

        var subjectClaim = decodedToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);
        Assert.NotNull(subjectClaim);
        Assert.Equal(user.Id.ToString(), subjectClaim.Value);

        var nameClaim = decodedToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Name);
        Assert.NotNull(nameClaim);
        Assert.Equal(user.Username, nameClaim.Value);
    }
}