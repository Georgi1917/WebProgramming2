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
                                            .OrderBy(ps => ps.Position)
                                            .ToList();

        return list.Select(ps => new PlaylistSongsReadDto
        {
            PlaylistId = ps.PlaylistId,
            SongId = ps.SongId,
            AddedAt = ps.AddedAt,
            Position = ps.Position,
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

    public void Save(PlaylistSongsCreateDto dto, int userId)
    {
        
        if (!CheckIfUserOwnsPlaylist(dto.PlaylistId, userId))
            throw new Exception("User does not own this playlist!");

        if (!_context.Songs.Any(s => s.Id == dto.SongId))
            throw new Exception("Song not Found");

        if (CheckIfExists(dto.PlaylistId, dto.SongId))
            throw new Exception("Song already added");

        int maxPos = _context.PlaylistSongs
                        .Where(ps => ps.PlaylistId == dto.PlaylistId)
                        .Max(ps => (int?)ps.Position) ?? 0;

        int finalPos = maxPos + 1;

        PlaylistSongs ps = new PlaylistSongs
        {
            PlaylistId = dto.PlaylistId,
            SongId = dto.SongId,
            Position = finalPos,
            AddedAt = DateTime.UtcNow
        };

        _context.PlaylistSongs.Add(ps);
        _context.SaveChanges();

    }

    public void Update(PlaylistSongsUpdateDto dto, int userId)
    {
        
        PlaylistSongs ps = _context.PlaylistSongs
                                    .FirstOrDefault(ps => ps.PlaylistId == dto.PlaylistId && ps.SongId == dto.SongId);

        if (ps == null)
            throw new Exception("Entity Does Not Exist");

        if (!CheckIfUserOwnsPlaylist(ps.PlaylistId, userId))
            throw new Exception("User does not own this playlist!");

        int maxPos = _context.PlaylistSongs
                                .Where(ps => ps.PlaylistId == dto.PlaylistId && ps.SongId == dto.SongId)
                                .Max(ps => ps.Position);

        int newPos = Math.Clamp(dto.Position, 1, maxPos);

        int oldPos = ps.Position;

        if (newPos == ps.Position)
            return;

        if (newPos < oldPos)
        {
            _context.PlaylistSongs
                    .Where(ps => ps.PlaylistId == dto.PlaylistId &&
                                 ps.SongId == dto.SongId &&
                                 ps.Position >= newPos && ps.Position < oldPos)
                    .ExecuteUpdate(ps => ps.SetProperty(p => p.Position, p => p.Position + 1));
        }
        else
        {
            
            _context.PlaylistSongs
                    .Where(ps => ps.PlaylistId == dto.PlaylistId &&
                                 ps.SongId == dto.SongId &&
                                 ps.Position > oldPos && ps.Position <= newPos)
                    .ExecuteUpdate(ps => ps.SetProperty(p => p.Position, p => p.Position - 1));

        }

        ps.Position = newPos;
        _context.SaveChanges();

    }

    public void RemoveSong(int playlistId, int songId, int userId)
    {
        
        PlaylistSongs entity = _context.PlaylistSongs.FirstOrDefault(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

        if (entity == null)
            throw new Exception("Entity Does Not Exist");

        if (!CheckIfUserOwnsPlaylist(entity.PlaylistId, userId))
            throw new Exception("User does not own this playlist");

        int removedPos = entity.Position;

        _context.PlaylistSongs.Remove(entity);

        _context.PlaylistSongs.Where(ps => ps.PlaylistId == entity.PlaylistId &&
                                           ps.SongId == entity.SongId &&
                                           ps.Position < removedPos)
                              .ExecuteUpdate(ps => ps.SetProperty(p => p.Position, p => p.Position - 1));

        _context.SaveChanges();

    }

}
