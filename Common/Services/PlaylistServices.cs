using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;

namespace Common.Services;

public class PlaylistServices
{

    private readonly AppDbContext _context;

    public PlaylistServices(AppDbContext context)
    {
        _context = context;
    }

    public List<Playlist> Get(int userId)
    {
        return _context.Playlists.Where(u => u.UserId == userId).ToList();
    }

    public Playlist GetById(int userId, int playlistId)
    {
        
        return _context.Playlists.FirstOrDefault(p => (p.Id == playlistId && p.UserId == userId));

    }

    public void Save(int userId, Playlist playlist)
    {
        
        User needed = _context.Users.FirstOrDefault(u => u.Id == userId);

        if (needed != null)
        {
            
            playlist.User = needed;
            playlist.UserId = userId;
            _context.Playlists.Add(playlist);
            _context.SaveChanges();

        }

    }

    public bool Update(int userId, int playlistId, Playlist playlist)
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
