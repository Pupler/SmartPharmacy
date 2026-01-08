using Microsoft.EntityFrameworkCore;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Builder Service for database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(10, 4, 27)),
        options => options.EnableRetryOnFailure()
    );
});

// CORS policy for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173") // React dev server port
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Required services
builder.Services.AddControllers(); // Enables API controllers
builder.Services.AddEndpointsApiExplorer(); // For Swagger
builder.Services.AddSwaggerGen(); // For API documentation

var app = builder.Build();

// Check database connection
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    try
    {
        if (dbContext.CanConnect())
        {
            Console.WriteLine("✅ Database connected!");
        }
        else
        {
            Console.WriteLine("❌ Database not connected");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database error: {ex.Message}");
    }
}

// Enable CORS
app.UseCors("AllowReact");

// Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

// Test endpoints
app.MapGet("/", () => "SmartPharmacy API Server is running! 🚀");
app.MapGet("/test", () => "Test endpoint works!");
app.MapGet("/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    version = "1.0.0"
});
app.MapGet("/api/debug", () => new { 
    message = "API debug endpoint",
    endpoints = new[] { "/api/medicines", "/api/test" }
});

app.UseAuthorization();
app.MapControllers(); // Maps controller routes

app.Run();