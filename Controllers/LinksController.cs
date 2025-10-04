using ContentHub.Data;
using ContentHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentHub.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LinksController : ControllerBase 
{
  private readonly ApiDbContext _context;

  public LinksController(ApiDbContext context)
  {
    _context = context;
  }

  [HttpGet]
  public async Task<IActionResult> GetAllLinks()
  {
    var links = await _context.Links.OrderByDescending(l => l.AddedOn).ToListAsync();
    return Ok(links);
  }

  [HttpPost]
  public async Task<IActionResult> AddLink([FromBody] CreateLinkDto newLink)
  {
    var link = new SavedLink
    {
      Url = newLink.Url,
      Title = newLink.Title,
      Description = newLink.Description
    };

    _context.Links.Add(link);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAllLinks), new { id = link.Id }, link);
  }

  [HttpPut("{id}/mark-as-read")]
  public async Task<IActionResult> MarkAsRead(int id)
  {
    var link = await _context.Links.FindAsync(id);

    if (link is null) return NotFound();
    
    link.IsRead = true;
    await _context.SaveChangesAsync();

    return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteLink(int id) 
  {
    var link = await _context.Links.FindAsync(id);

    if(link is null) return NotFound();

    _context.Links.Remove(link);
    await _context.SaveChangesAsync();

    return Ok(link);
  }
}
