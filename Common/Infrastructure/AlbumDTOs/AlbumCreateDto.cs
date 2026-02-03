using System;
using System.ComponentModel.DataAnnotations;

namespace Common.Infrastructure.AlbumDTOs;

public class AlbumCreateDto
{
    [Required]
    [MinLength(2)]
    public string Title { get; set; }
    [Required]
    public DateOnly ReleaseDate { get; set; }
    [Required]
    public int ArtistId { get; set; }

}
