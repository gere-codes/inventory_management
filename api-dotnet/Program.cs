
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)); 
builder.Services.AddScoped<IAuthRepository, AuthRepository>();


var app = builder.Build();

app.UseExceptionHandler();

app.MapGet("/health", () => "I'm healthy!");
app.MapControllers();




using (var scope = app.Services.CreateScope())
{
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


app.Run();