using System;
using Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Common.Data;

public class AppDbContext : DbContext
{

    public DbSet<User> Users { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        #region User

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        #endregion


    }

}
