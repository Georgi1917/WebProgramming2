using System;
using System.Collections.Generic;
using Common.Entities;

namespace Common.Infrastructure.User;

public class UserReadDto
{

    public int Id          { get; set; }
    public string Username { get; set; }
    public string Email    { get; set; }

}
