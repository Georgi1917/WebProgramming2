using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.AlbumDTOs;

namespace Common.Services;

public class AlbumService
{

    private readonly AppDbContext _context;

    public AlbumService(AppDbContext context)
    {
        
        _context = context;

    }

    public List<AlbumReadDto> GetAll()
    {
        
        return _context.Albums.AsQueryable()
                       .Select(e => new AlbumReadDto
                       {
                           Id = e.Id,
                           Title = e.Title,
                           ReleaseDate = e.ReleaseDate,
                           ArtistId = e.ArtistId
                       }).ToList();

    }

    public AlbumReadDto Get(int id)
    {
        
        return _context.Albums.Select(e => new AlbumReadDto
                                {
                                    Id = e.Id,
                                    Title = e.Title,
                                    ReleaseDate = e.ReleaseDate,
                                    ArtistId = e.ArtistId
                                }).FirstOrDefault(e => e.Id == id);

    }

    public void Save(AlbumCreateDto dto)
    {
        
        Album album = new Album
        {
            Title = dto.Title,
            ReleaseDate = dto.ReleaseDate,
            ArtistId = dto.ArtistId
        };

        _context.Albums.Add(album);
        _context.SaveChanges();

    }

    public bool Update(int id, AlbumCreateDto dto)
    {
        
        Album forUpdate = _context.Albums.Find(id);

        if (forUpdate == null) return false;

        forUpdate.Title = dto.Title;
        forUpdate.ReleaseDate = dto.ReleaseDate;
        forUpdate.ArtistId = dto.ArtistId;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int id)
    {
        
        Album forDelete = _context.Albums.Find(id);

        if (forDelete != null) _context.Albums.Remove(forDelete);

        _context.SaveChanges();

    }

}
