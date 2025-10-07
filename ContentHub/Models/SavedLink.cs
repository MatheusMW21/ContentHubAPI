namespace ContentHub.Models;

public class SavedLink
{
  public int Id { get; set; }
  public string? Url { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public DateTime AddedOn { get; set; } = DateTime.UtcNow;
  public bool IsRead { get; set; }
  public ICollection<Tag> Tags { get; set; } = new List<Tag>();
  public int UserId { get; set; }
  public User? User { get; set; }
}
