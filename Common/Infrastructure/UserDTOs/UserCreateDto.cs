using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.UserDTOs;

public class UserCreateDto
{
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    [MinLength(3)]
    public string Password { get; set; }
    public string Role { get; set; }

}
