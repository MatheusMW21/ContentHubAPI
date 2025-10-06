using ContentHub.Models;

namespace ContentHub.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}