using System.Text;
using System.Text.Json.Serialization;
using ContentHub.Data;
using ContentHub.Models;
using ContentHub.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

var AllowSpecificOrigins = "_allowSpecificOrigins";
builder.Services.AddCors(options =>
{
  options.AddPolicy(name: AllowSpecificOrigins,
                    policy =>
                    {
                      policy.WithOrigins("http://localhost:5173",
                                         "https://localhost:5173",
                                         "https://content-hub-api-tau.vercel.app")
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
});

builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
  };
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApiDbContext>(options => options.UseNpgsql(connectionString).LogTo(Console.WriteLine, LogLevel.Information));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
      options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
      options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
      options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddHttpClient();
builder.Services.AddScoped<IWebScrapingService, WebScrapingService>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
  options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.Http,
    Scheme = "Bearer",
    BearerFormat = "JWT",
    Description = "Insira o token JWT desta forma: Bearer {seu token}"
  });
  options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;
  var context = services.GetRequiredService<ApiDbContext>();
  var configuration = services.GetRequiredService<IConfiguration>();

  context.Database.Migrate();

  DataSeeder.Seed(context, configuration);
}

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }