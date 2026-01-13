using Microsoft.EntityFrameworkCore;
using Common.Data;
using Microsoft.Extensions.Options;
using Common.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => 
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<ArtistServices>();
builder.Services.AddScoped<PlaylistServices>();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

