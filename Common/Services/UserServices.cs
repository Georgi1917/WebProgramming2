using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Common.Services;

public class UserServices
{

    private readonly AppDbContext _context;

    public UserServices(AppDbContext context)
    {
        
        _context = context;

    }

    public List<User> GetAll()
    {
        
        return _context.Users.AsQueryable().ToList();

    }

    public User GetById(int id)
    {
        
        return _context.Users.FirstOrDefault(u => u.Id == id);

    }

    public void Save(User user)
    {

        _context.Users.Add(user);
        _context.SaveChanges();

    }

    public bool Update(int id, User item)
    {
        
        User forUpdate = _context.Users.Find(id);

        if (forUpdate == null) return false;

        forUpdate.Username = item.Username;
        forUpdate.Email    = item.Email;
        forUpdate.Password = item.Password;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int id)
    {
        
        User needed = _context.Users.FirstOrDefault(u => u.Id == id);
        if (needed != null) _context.Users.Remove(needed);
        _context.SaveChanges();

    }

}
