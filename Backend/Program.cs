using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Backend.Data;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = "SUPER_SECRET_KEY_123456789";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

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

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";

        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            message = "Too many requests. Please try again later."
        }, token);
    };

    options.AddFixedWindowLimiter("login", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 5;
        opt.QueueLimit = 0;
    });

    options.AddFixedWindowLimiter("register", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(60);
        opt.PermitLimit = 3;
        opt.QueueLimit = 0;
    });
});

builder.Services.AddEndpointsApiExplorer(); // For Swagger
builder.Services.AddSwaggerGen(); // For API documentation
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

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

app.UseRateLimiter();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // Maps controller routes

app.Run();