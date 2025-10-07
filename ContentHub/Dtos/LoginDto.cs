using System.ComponentModel.DataAnnotations;

namespace ContentHub.Dtos;

public record LoginDto(
    [Required] string Username, 
    [Required] string Password
);