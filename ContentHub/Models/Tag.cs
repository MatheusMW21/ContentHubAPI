using System.Text.Json.Serialization;

namespace ContentHub.Models;

public class Tag
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public ICollection<SavedLink> Links{ get; set; } = new List<SavedLink>();
}
