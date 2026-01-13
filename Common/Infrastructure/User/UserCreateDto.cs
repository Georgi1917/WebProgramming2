using System;

namespace Common.Infrastructure.User;

public class UserCreateDto
{
    
    public string Username { get; set; }
    public string Email    { get; set; }
    public string Password { get; set; }

}
