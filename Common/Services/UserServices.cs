using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class UserServices
{

    static List<User> users;

    static UserServices()
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
        
        return users.FirstOrDefault(u => u.Id == id);

    }

    public void Save(User user)
    {
        
        if (user.Id > 0)
        {
            
            User forUpdate = users.FirstOrDefault(u => u.Id == user.Id);

            forUpdate.Username = user.Username;
            forUpdate.Email = user.Email;
            forUpdate.Password = user.Password;

        }
        else
        {

            user.Id = users.Max(u => u.Id) == 0 ? 1 : users.Max(u => u.Id) + 1;
            users.Add(user);

        }

    }

    public void Delete(int id)
    {
        
        User needed = users.FirstOrDefault(u => u.Id == id);
        if (needed != null) users.Remove(needed);

    }

}
