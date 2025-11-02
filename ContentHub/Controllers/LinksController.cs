using ContentHub.Data;
using ContentHub.Models;
using ContentHub.Services;
using ContentHub.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ContentHub.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LinksController : ControllerBase
{
  private readonly ApiDbContext _context;
  private readonly IWebScrapingService _scrapingService;
  private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

  public LinksController(ApiDbContext context, IWebScrapingService scrapingService)
  {
    _context = context;
    _scrapingService = scrapingService;
  }

  [HttpGet]
  public async Task<IActionResult> GetAllLinks([FromQuery(Name = "tag")] string? tagName)
  {
    var currentUserId = CurrentUserId;

    IQueryable<SavedLink> query = _context.Links
      .Where(link => link.UserId == currentUserId);

    if (!string.IsNullOrWhiteSpace(tagName))
    {
      var lowerCaseTagName = tagName.ToLower();
      query = query.Where(l => l.Tags.Any(t => t.Name.ToLower() == lowerCaseTagName));
    }

    var links = await query
        .Include(l => l.Tags)
        .OrderByDescending(l => l.AddedOn)
        .ToListAsync();

    var linksDto = links.Select(MapToLinkDto).ToList();

    return Ok(linksDto);
  }

  [HttpPost]
  public async Task<IActionResult> AddLink([FromBody] CreateLinkDto newLink)
  {
    var title = newLink.Title;
    if (string.IsNullOrWhiteSpace(title))
    {
      title = await _scrapingService.GetPageTitleAsync(newLink.Url);
    }

    var link = new SavedLink
    {
      Url = newLink.Url,
      Title = title,
      Description = newLink.Description,
      UserId = CurrentUserId
    };

    _context.Links.Add(link);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAllLinks), new { id = link.Id }, MapToLinkDto(link));
  }

  [HttpPost("{linkId}/tags")]
  public async Task<IActionResult> AddTagToLink(int linkId, [FromBody] AddTagDto addTagDto)
  {
    var link = await _context.Links
      .Include(l => l.Tags)
      .FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == CurrentUserId);

    if (link is null)
    {
      return NotFound("Link não encontrado.");
    }

    var tagName = addTagDto.TagName.Trim().ToLower();
    var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Name == tagName);

    if (tag is null)
    {
      tag = new Tag { Name = tagName };
      _context.Tags.Add(tag);
    }

    if (!link.Tags.Any(t => t.Name == tagName))
    {
      link.Tags.Add(tag);
    }

    await _context.SaveChangesAsync();

    return Ok(MapToLinkDto(link));
  }


  [HttpPut("{id}/toggle-read")]
  public async Task<IActionResult> ToggleReadStatus(int id)
  {
    var link = await _context.Links
        .Include(l => l.Tags)
        .FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);

    if (link is null) return NotFound();

    link.IsRead = !link.IsRead;
    await _context.SaveChangesAsync();

    return Ok(MapToLinkDto(link));
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateLink(int id, [FromBody] UpdateLinkDto updateLinkDto)
  {
    var link = await _context.Links
      .Include(l => l.Tags)
      .FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);

    if (link is null) return NotFound();

    link.Title = updateLinkDto.Title;
    link.Description = updateLinkDto.Description;

    await _context.SaveChangesAsync();

    return Ok(MapToLinkDto(link));
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteLink(int id)
  {

    var link = await _context.Links
      .Include(l => l.Tags)
      .FirstOrDefaultAsync(l => l.Id == id && l.UserId == CurrentUserId);

    if (link is null) return NotFound();

    _context.Links.Remove(link);
    await _context.SaveChangesAsync();

    return Ok(MapToLinkDto(link));
  }

  private LinkDto MapToLinkDto(SavedLink link)
  {
    return new LinkDto(
      link.Id,
      link.Url ?? string.Empty,
      link.Title,
      link.Description,
      link.AddedOn,
      link.IsRead,
      link.Tags.Select(tag => new TagDto(tag.Id, tag.Name)).ToList()
    );
  }
}
