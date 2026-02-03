using System;

namespace Common.Infrastructure.SongDTOs;

public class SongReadDto
{

    public int Id { get; set; }

    public string Title { get; set; }
    public int DurationInSeconds { get; set; }
    public string StreamUrl { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
    public long Size { get; set; }

    public int GenreId { get; set; }
    public int AlbumId { get; set; }

}
