using System;

namespace Common.Infrastructure.AlbumDTOs;

public class AlbumCreateDto
{

    public string Title { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ArtistId { get; set; }

}
