using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.GenreDTOs;
using Common.Infrastructure.SongDTOs;

namespace Common.Services;

public class GenreService
{

    private readonly AppDbContext _context;

    public GenreService(AppDbContext context)
    {
        _context = context;
    }

    public List<GenreReadDto> Get()
    {
        
        return _context.Genres
                        .AsQueryable()
                        .Select(e => new GenreReadDto
                        {
                            Id = e.Id,
                            Name = e.Name
                        }).ToList();

    }

    public GenreDetailDto GetById(int id)
    {
        
        Genre e = _context.Genres.Find(id);

        return new GenreDetailDto
        {
            Id = e.Id,
            Name = e.Name,
            Songs = e.Songs.Select(s => new SongReadDto
            {
                Id = s.Id,
                Title = s.Title,
                DurationInSeconds = s.DurationInSeconds,
                StreamUrl = s.FilePath,
                FileName = s.FileName,
                ContentType = s.ContentType,
                Size = s.Size,
                GenreId = s.GenreId,
                AlbumId = s.AlbumId
            }).ToList()
        };

    }

    public void Save(GenreBaseDto dto)
    {
        
        Genre e = new Genre
        {
            Name = dto.Name
        };

        _context.Genres.Add(e);
        _context.SaveChanges();

    }

    public bool Update(int id, GenreBaseDto dto)
    {
        
        Genre e = _context.Genres.Find(id);

        if (e == null) return false;

        e.Name = dto.Name;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int id)
    {
        
        Genre e = _context.Genres.Find(id);

        if (e != null) _context.Genres.Remove(e);

        _context.SaveChanges();

    }

}
