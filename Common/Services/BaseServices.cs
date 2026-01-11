using System;
using System.Collections.Generic;
using System.Linq;
using Common.Entities;

namespace Common.Services;

public class BaseServices<T>
    where T : BaseEntity
{

    private static List<T> items;

    static BaseServices()
    {
        
        items = new List<T>();

    }

    public List<T> GetAll()
    {
        
        return items;

    }

    public T GetById(int id)
    {
        
        return items.FirstOrDefault(i => i.Id == id);

    }

    public void Save(T item)
    {
        
        if (item.Id > 0)
        {
            
            T forUpdate = items.FirstOrDefault(i => i.Id == item.Id);

            // forUpdate.Username = user.Username;
            // forUpdate.Email = user.Email;
            // forUpdate.Password = user.Password;

        }
        else
        {

            item.Id = items.Max(u => u.Id) == 0 ? 1 : items.Max(u => u.Id) + 1;
            items.Add(item);

        }

    }

    public void Delete(int id)
    {
        
        T needed = items.FirstOrDefault(u => u.Id == id);
        if (needed != null) items.Remove(needed);

    }

}
