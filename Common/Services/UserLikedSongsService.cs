using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.SongDTOs;
using Common.Infrastructure.UserLikedSongsDTOs;
using Microsoft.EntityFrameworkCore;

namespace Common.Services;

public class UserLikedSongsService
{

    private readonly AppDbContext _context;

    public UserLikedSongsService(AppDbContext context)
    {
        _context = context;
    }

    public List<UserLikedSongsReadDto> GetLikedSongsByUser(int UserId)
    {
        
        List<UserLikedSongs> list = _context.UserLikedSongs
                                                    .Where(uls => uls.UserId == UserId)
                                                    .Include(uls => uls.Song)
                                                    .ToList();

        return list.Select(e => new UserLikedSongsReadDto
        {
            UserId = e.UserId,
            SongId = e.SongId,
            AddedAt = e.AddedAt,
            Song = new SongReadDto
            {
                Id = e.Song.Id,
                Title = e.Song.Title,
                DurationInSeconds = e.Song.DurationInSeconds,
                StreamUrl = e.Song.FilePath,
                FileName = e.Song.FileName,
                ContentType = e.Song.ContentType,
                Size = e.Song.Size,
                AlbumId = e.Song.AlbumId
            }
        }).ToList();

    }

    public void Save(UserLikedSongsBaseDto dto)
    {
        
        UserLikedSongs uls = new UserLikedSongs
        {
            UserId = dto.UserId,
            SongId = dto.SongId,
            AddedAt = DateTime.UtcNow
        };

        _context.UserLikedSongs.Add(uls);
        _context.SaveChanges();

    }

    public void Delete(int userId, int songId)
    {
        
        UserLikedSongs needed = _context.UserLikedSongs
                                        .FirstOrDefault(e => e.UserId == userId && e.SongId == songId);

        if (needed != null) _context.UserLikedSongs.Remove(needed);

        _context.SaveChanges();

    }

}
