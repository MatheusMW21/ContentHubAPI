using ContentHub.Models;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Data;

public class ApiDbContext : DbContext
{
  public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
  {
  }

  public DbSet<SavedLink> Links { get; set; }
  public DbSet<Tag> Tags { get; set; }
}
