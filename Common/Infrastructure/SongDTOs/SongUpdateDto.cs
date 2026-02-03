using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.SongDTOs;

public class SongUpdateDto
{
    [Required]
    [MinLength(1)]
    public string Title { get; set; }
    [Required]
    public int DurationInSeconds { get; set; }
    [Required]
    public int GenreId { get; set; }

}
