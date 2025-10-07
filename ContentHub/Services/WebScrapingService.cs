using HtmlAgilityPack;

namespace ContentHub.Services;

public class WebScrapingService : IWebScrapingService 
{
  private readonly IHttpClientFactory _httpClientFactory;

  public WebScrapingService(IHttpClientFactory httpClientFactory) 
  {
    _httpClientFactory = httpClientFactory;
  }

  public async Task<string?> GetPageTitleAsync(string url)
  {
    try
    {
        var httpClient = _httpClientFactory.CreateClient();
        var html = await httpClient.GetStringAsync(url);

        var htmlDocument = new HtmlDocument();
        htmlDocument.LoadHtml(html);

        var titleNode = htmlDocument.DocumentNode.SelectSingleNode("//title");

        return titleNode != null ? HtmlEntity.DeEntitize(titleNode.InnerText) : null;
    }
    catch (Exception)
    {
      return null;
    }
  }
}

