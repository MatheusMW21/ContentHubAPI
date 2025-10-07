namespace ContentHub.Dtos;

public record LinkDto (
  int Id,
  string Url,
  string? Title,
  string? Description,
  DateTime AddedOn,
  bool IsRead,
  List<TagDto> Tags
);
