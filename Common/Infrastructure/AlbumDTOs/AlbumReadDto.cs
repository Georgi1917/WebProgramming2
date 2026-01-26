using System;

namespace Common.Infrastructure.AlbumDTOs;

public class AlbumReadDto
{

    public int Id { get; set; }
    public string Title { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ArtistId { get; set; }

}
