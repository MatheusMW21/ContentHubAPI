using System.ComponentModel.DataAnnotations;

namespace ContentHub.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; }
    [Required]
    public string PasswordHash { get; set; }
    public ICollection<SavedLink> Links { get; set; } = new List<SavedLink>();
}
