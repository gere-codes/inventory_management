using api_dotnet.Configuration;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCustomAuthentication(builder.Configuration);
builder.Services.AddCustomAuthorization();
builder.Services.AddCustomCors();
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

var app = builder.Build();

app.UseExceptionHandler();

// app.UseHttpsRedirection();        
app.UseCors("ReactFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => "I'm healthy!");
app.MapControllers();

await TestDatabaseConnectionAsync(app);

app.Run();

static async Task TestDatabaseConnectionAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    try
    {
        await db.Database.OpenConnectionAsync();

        Console.WriteLine("Database connection successful!");

        await db.Database.CloseConnectionAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Database connection failed!");
        Console.WriteLine(ex.Message);
    }
}
