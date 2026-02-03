using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.SongDTOs;

public class SongCreateDto
{
    [Required]
    [MinLength(1)]
    public string Title { get; set; }
    [Required]
    public int DurationInSeconds { get; set; }
    [Required]
    public int GenreId { get; set; }
    [Required]
    public int AlbumId { get; set; }

}
