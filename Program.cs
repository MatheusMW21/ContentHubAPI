using ContentHub.Data;
using ContentHub.Models;
using ContentHub.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=contenthub.db";
builder.Services.AddDbContext<ApiDbContext>(options => options.UseSqlite(connectionString));

builder.Services.AddControllers();

builder.Services.AddHttpClient();
builder.Services.AddScoped<IWebScrapingService, WebScrapingService>();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();


