using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.PlaylistDTOs;

public class PlaylistCreateDto
{
    [Required]
    [MinLength(3)]
    public string Title { get; set; }

}
