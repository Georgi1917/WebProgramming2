using System;
using Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Common.Data;

public class AppDbContext : DbContext
{

    public DbSet<User> Users { get; set; }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<Album> Albums { get; set; }
    public DbSet<Song> Songs { get; set; }
    public DbSet<PlaylistSongs> PlaylistSongs { get; set; }
    public DbSet<UserLikedSongs> UserLikedSongs { get; set; }

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

        #region Album

        modelBuilder.Entity<Album>()
            .HasKey(e => e.Id);

        modelBuilder.Entity<Album>()
            .HasOne(e => e.Artist)
            .WithMany(e => e.Albums)
            .HasForeignKey(e => e.ArtistId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion

        #region Song

        modelBuilder.Entity<Song>()
            .HasKey(e => e.Id);

        modelBuilder.Entity<Song>()
            .HasOne(e => e.Album)
            .WithMany(e => e.Songs)
            .HasForeignKey(e => e.AlbumId)
            .OnDelete(DeleteBehavior.Cascade);

        #endregion

        #region PlaylistSongs

        modelBuilder.Entity<PlaylistSongs>()
            .HasKey(ps => ps.Id);

        modelBuilder.Entity<PlaylistSongs>()
            .HasOne(ps => ps.Playlist)
            .WithMany(p => p.PlaylistSongs)
            .HasForeignKey(ps => ps.PlaylistId);

        modelBuilder.Entity<PlaylistSongs>()
            .HasOne(ps => ps.Song)
            .WithMany(s => s.PlaylistSongs)
            .HasForeignKey(ps => ps.SongId);

        #endregion

        #region UserLikedSongs

        modelBuilder.Entity<UserLikedSongs>()
            .HasKey(e => e.Id);

        modelBuilder.Entity<UserLikedSongs>()
            .HasOne(e => e.User)
            .WithMany(u => u.LikedSongs)
            .HasForeignKey(e => e.UserId);

        modelBuilder.Entity<UserLikedSongs>()
            .HasOne(e => e.Song)
            .WithMany(s => s.LikedByUsers)
            .HasForeignKey(e => e.SongId);

        #endregion

    }

}
