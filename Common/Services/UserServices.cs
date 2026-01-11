using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Common.Services;

public class UserServices
{

    //static List<User> users;
    private readonly AppDbContext _context;
    private DbSet<User> Items;

    public UserServices(AppDbContext context)
    {
        
        _context = context;
        Items = _context.Set<User>();

    }

    public List<User> GetAll()
    {
        
        return Items.AsQueryable().ToList();

    }

    public User GetById(int id)
    {
        
        return Items.FirstOrDefault(u => u.Id == id);

    }

    public void Save(User user)
    {
        
        if (user.Id > 0)
        {
            
            _context.Users.Update(user);
            _context.SaveChanges();

        }
        else
        {

            _context.Users.Add(user);
            _context.SaveChanges();

        }

    }

    public void Delete(int id)
    {
        
        User needed = _context.Users.FirstOrDefault(u => u.Id == id);
        if (needed != null) _context.Users.Remove(needed);
        _context.SaveChanges();

    }

}
