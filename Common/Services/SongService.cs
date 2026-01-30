using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.SongDTOs;

namespace Common.Services;

public class SongService
{

    private readonly AppDbContext _context;

    public SongService(AppDbContext context)
    {
        _context = context;
    }

    public List<SongReadDto> Get()
    {
        
        return _context.Songs
                        .AsQueryable()
                        .Select(e => new SongReadDto
                        {
                            Id = e.Id,
                            Title = e.Title,
                            DurationInSeconds = e.DurationInSeconds,
                            StreamUrl = e.FilePath,
                            FileName = e.FileName,
                            ContentType = e.ContentType,
                            Size = e.Size,
                            AlbumId = e.AlbumId
                        }).ToList();

    }

    public SongReadDto GetById(int id)
    {
        
        return _context.Songs
                        .AsQueryable()
                        .Select(e => new SongReadDto
                        {
                            Id = e.Id,
                            Title = e.Title,
                            DurationInSeconds = e.DurationInSeconds,
                            StreamUrl = e.FilePath,
                            FileName = e.FileName,
                            ContentType = e.ContentType,
                            Size = e.Size,
                            AlbumId = e.AlbumId
                        }).FirstOrDefault(e => e.Id == id);

    }

    public void Save(Song song)
    {
        
        _context.Songs.Add(song);
        _context.SaveChanges();

    }

    public bool Update(int id, SongUpdateDto dto)
    {
        
        Song needed = _context.Songs.Find(id);

        if (needed == null) return false;

        needed.Title = dto.Title;
        needed.DurationInSeconds = dto.DurationInSeconds;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int id)
    {
        
        Song needed = _context.Songs.Find(id);
        if (needed != null) _context.Songs.Remove(needed);
        _context.SaveChanges();

    }

}
