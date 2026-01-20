using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.ArtistDTOs;

namespace Common.Services;

public class ArtistServices
{

    private readonly AppDbContext _context;

    public ArtistServices(AppDbContext context)
    {
        
        _context = context;

    }

    public List<ArtistReadDto> GetAll()
    {
        
        return _context.Artists
                        .AsQueryable()
                        .Select(a => new ArtistReadDto
                        {
                            Id = a.Id,
                            Name = a.Name,
                            Country = a.Country
                        })
                        .ToList();

    }

    public ArtistReadDto GetById(int id)
    {
        
        Artist a = _context.Artists.FirstOrDefault(i => i.Id == id);
        return new ArtistReadDto
        {
            Id = a.Id,
            Name = a.Name,
            Country = a.Country
        };

    }

    public void Save(ArtistCreateDto item)
    {
    
        Artist a = new Artist
        {
            Name = item.Name,
            Country = item.Country
        };

        _context.Artists.Add(a);
        _context.SaveChanges();

    }

    public bool Update(int id, ArtistCreateDto item)
    {
        
        Artist forUpdate = _context.Artists.Find(id);

        if (forUpdate == null) return false;

        forUpdate.Name    = item.Name;
        forUpdate.Country = item.Country;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int id)
    {
        
        Artist needed = _context.Artists.FirstOrDefault(i => i.Id == id);
        if (needed != null) _context.Artists.Remove(needed);
        _context.SaveChanges();

    }    

}
