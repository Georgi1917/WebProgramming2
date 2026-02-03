using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.ArtistDTOs;

public class ArtistCreateDto
{
    [Required]
    [MinLength(3)]
    public string Name { get; set; }
    [Required]
    [MinLength(2)]
    public string Country { get; set; }

}
