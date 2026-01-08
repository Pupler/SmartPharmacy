using Microsoft.EntityFrameworkCore;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

// Builder Service for database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 35)) // Version of MySQL
));

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

// Enable CORS
app.UseCors("AllowReact");

// Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers(); // Maps controller routes

app.Run();