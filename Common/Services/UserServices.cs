using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Common.Data;
using Common.Entities;
using Common.Infrastructure.AuthDTOs;
using Common.Infrastructure.UserDTOs;
using Microsoft.EntityFrameworkCore;

namespace Common.Services;

public class UserServices
{

    private readonly AppDbContext _context;

    private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
    {
        
        using var hmac = new HMACSHA512();

        salt = hmac.Key;
        hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

    }

    public UserServices(AppDbContext context)
    {
        
        _context = context;

    }

    public List<UserReadDto> GetAll()
    {
        
        return _context.Users
                        .AsQueryable()
                        .Select(e => new UserReadDto
                        {
                            Id = e.Id,
                            Username = e.Username,
                            Email = e.Email
                        })
                        .ToList();

    }

    public UserReadDto GetById(int id)
    {
        
        return _context.Users
                        .Select(e => new UserReadDto
                        {
                            Id = e.Id,
                            Username = e.Username,
                            Email = e.Email
                        })
                        .FirstOrDefault(u => u.Id == id);

    }

    public User GetByUsername(string username)
    {
        
        return _context.Users
                        .FirstOrDefault(u => u.Username == username);

    }

    public void Save(RegisterDto dto)
    {

        CreatePasswordHash(dto.Password, out var hash, out var salt);

        User user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        _context.Users.Add(user);
        _context.SaveChanges();

    }

    public bool Update(int id, UserUpdateDto item)
    {
        
        User forUpdate = _context.Users.Find(id);

        if (forUpdate == null) return false;

        forUpdate.Username = item.Username;
        forUpdate.Email    = item.Email;

        _context.SaveChanges();

        return true;

    }

    public void Delete(int id)
    {
        
        User needed = _context.Users.Find(id);
        if (needed != null) _context.Users.Remove(needed);
        _context.SaveChanges();

    }

}
