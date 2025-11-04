using HtmlAgilityPack;
using Microsoft.Extensions.Logging; 
using System.Net.Http; 

namespace ContentHub.Services;

public class WebScrapingService : IWebScrapingService 
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<WebScrapingService> _logger; 

    public WebScrapingService(IHttpClientFactory httpClientFactory, ILogger<WebScrapingService> logger) 
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<string?> GetPageTitleAsync(string url)
    {
        try
        {
            var httpClient = _httpClientFactory.CreateClient();

            httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
            );

            var html = await httpClient.GetStringAsync(url);

            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(html);

            var titleNode = htmlDocument.DocumentNode.SelectSingleNode("//title");

            return titleNode != null ? HtmlEntity.DeEntitize(titleNode.InnerText) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Falha ao fazer web scraping da URL: {Url}", url);
            return null; 
        }
    }
}