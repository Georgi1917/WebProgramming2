using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;

namespace Common.Services;

public class ArtistServices
{

    private readonly AppDbContext _context;

    public ArtistServices(AppDbContext context)
    {
        
        _context = context;

    }

    public List<Artist> GetAll()
    {
        
        return _context.Artists.AsQueryable().ToList();

    }

    public Artist GetById(int id)
    {
        
        return _context.Artists.FirstOrDefault(i => i.Id == id);

    }

    public void Save(Artist item)
    {
    
        _context.Artists.Add(item);
        _context.SaveChanges();

    }

    public bool Update(int id, Artist item)
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
