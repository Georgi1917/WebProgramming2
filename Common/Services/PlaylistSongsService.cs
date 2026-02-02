using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.PlaylistSongsDTOs;
using Common.Infrastructure.SongDTOs;
using Microsoft.EntityFrameworkCore;

namespace Common.Services;

public class PlaylistSongsService
{

    private readonly AppDbContext _context;

    public PlaylistSongsService(AppDbContext context)
    {
        _context = context;
    }

    private bool CheckIfExists(int playlistId, int songId)
    {
        
        return _context.PlaylistSongs.Any(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

    }

    private bool CheckIfUserOwnsPlaylist(int playlistId, int userId)
    {
        
        return _context.Playlists.Any(p => p.Id == playlistId && p.UserId == userId);

    }

    public List<PlaylistSongsReadDto> GetByPlaylist(int playlistId, int userId)
    {

        if (!CheckIfUserOwnsPlaylist(playlistId, userId))
            throw new Exception("User does not own this playlist!");
        
        List<PlaylistSongs> list = _context.PlaylistSongs
                                            .Where(ps => ps.PlaylistId == playlistId)
                                            .Include(ps => ps.Song)
                                            .ToList();

        return list.Select(ps => new PlaylistSongsReadDto
        {
            PlaylistId = ps.PlaylistId,
            SongId = ps.SongId,
            AddedAt = ps.AddedAt,
            Song = new SongReadDto
            {
                Id = ps.Song.Id,
                Title = ps.Song.Title,
                DurationInSeconds = ps.Song.DurationInSeconds,
                StreamUrl = ps.Song.FilePath,
                FileName = ps.Song.FileName,
                ContentType = ps.Song.ContentType,
                Size = ps.Song.Size,
                AlbumId = ps.Song.AlbumId
            }
        }).ToList();    

    }

    public void Save(BasePlaylistSongsDto dto, int userId)
    {
        
        if (!CheckIfUserOwnsPlaylist(dto.PlaylistId, userId))
            throw new Exception("User does not own this playlist!");

        if (!_context.Songs.Any(s => s.Id == dto.SongId))
            throw new Exception("Song not Found");

        if (CheckIfExists(dto.PlaylistId, dto.SongId))
            throw new Exception("Song already added");

        PlaylistSongs ps = new PlaylistSongs
        {
            PlaylistId = dto.PlaylistId,
            SongId = dto.SongId,
            AddedAt = DateTime.UtcNow
        };

        _context.PlaylistSongs.Add(ps);
        _context.SaveChanges();

    }

    public void RemoveSong(int playlistId, int songId, int userId)
    {
        
        PlaylistSongs entity = _context.PlaylistSongs.FirstOrDefault(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

        if (entity == null)
            throw new Exception("Entity Does Not Exist");

        if (!CheckIfUserOwnsPlaylist(entity.PlaylistId, userId))
            throw new Exception("User does not own this playlist");

        _context.PlaylistSongs.Remove(entity);

        _context.SaveChanges();

    }

}
