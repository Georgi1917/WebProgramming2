using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.AuthDTOs;

public class LoginDto
{
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
    [Required]
    [MinLength(3)]
    public string Password { get; set; }
}
