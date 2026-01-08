using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class UserServices
{

    static List<User> users;

    public UserServices()
    {
        
        users = new List<User>()
        {
            new User
            {
                Id = 1,
                Username = "Pesho",
                Email = "Pesho@abv.bg",
                Password = "1234567"
            },
            new User
            {
                Id = 2,
                Username = "Gosho",
                Email = "Gosho@abv.bg",
                Password = "234567333"
            }
        };

    }

    public List<User> GetAll()
    {
        
        return users;

    }

    public User GetById(int id)
    {
        
        User needed = users.FirstOrDefault(u => u.Id == id);
        return needed;

    }

    public void Save(User user)
    {
        
        users.Add(user);

    }

    public void Delete(int id)
    {
        
        User needed = users.FirstOrDefault(u => u.Id == id);
        if (needed != null) users.Remove(needed);

    }

}
