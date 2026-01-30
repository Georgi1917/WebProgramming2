using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.PlaylistDTOs;

namespace Common.Services;

public class PlaylistServices
{

    private readonly AppDbContext _context;

    public PlaylistServices(AppDbContext context)
    {
        _context = context;
    }

    public List<PlaylistReadDto> Get(int userId)
    {
        return _context.Playlists
                        .Where(u => u.UserId == userId)
                        .Select(p => new PlaylistReadDto
                        {
                            Id = p.Id,
                            Title = p.Title
                        })
                        .ToList();
    }

    public PlaylistReadDto GetById(int userId, int playlistId)
    {
        
        Playlist p = _context.Playlists.FirstOrDefault(p => p.Id == playlistId && p.UserId == userId);

        if (p == null)
            return new PlaylistReadDto
            {
                Id = 0,
                Title = "Invalid"
            };

        return new PlaylistReadDto
        {
            Id = p.Id,
            Title = p.Title
        };

    }

    public void Save(int userId, PlaylistCreateDto playlist)
    {
        
        User needed = _context.Users.FirstOrDefault(u => u.Id == userId);

        if (needed != null)
        {

            Playlist p = new Playlist
            {
                Title = playlist.Title,
                User = needed,
                UserId = userId
            };

            _context.Playlists.Add(p);
            _context.SaveChanges();

        }

    }

    public bool Update(int userId, int playlistId, PlaylistCreateDto playlist)
    {
        
        Playlist forUpdate = _context.Playlists
                                .FirstOrDefault(p => p.Id == playlistId && p.UserId == userId);

        if (forUpdate == null) return false;

        forUpdate.Title = playlist.Title;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int userId, int playlistId)
    {
        
        Playlist forDelete = _context.Playlists
                                .FirstOrDefault(p => p.Id == playlistId && p.UserId == userId);

        if (forDelete != null) _context.Playlists.Remove(forDelete);

        _context.SaveChanges();

    }

}
