namespace ContentHub.Services;

public interface IWebScrapingService 
{
  Task<string?> GetPageTitleAsync(string url);
}
