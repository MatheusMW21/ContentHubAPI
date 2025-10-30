using System.ComponentModel.DataAnnotations;

namespace ContentHub.Dtos;

public record RegisterDto(
    [Required] string Username,
    [Required] string Password,
    [Required] string PasswordConfirmation
);