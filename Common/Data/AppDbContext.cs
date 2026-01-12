using System;
using Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Common.Data;

public class AppDbContext : DbContext
{

    public DbSet<User> Users { get; set; }
    public DbSet<Artist> Artists { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        #region User

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        #endregion

        #region Playlist

        modelBuilder.Entity<Playlist>()
            .HasKey(e => e.Id);
            
        modelBuilder.Entity<Playlist>()
            .HasOne(e => e.User)
            .WithMany(u => u.Playlists)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion

        #region Artist

        modelBuilder.Entity<Artist>()
            .HasKey(u => u.Id);

        #endregion

    }

}
