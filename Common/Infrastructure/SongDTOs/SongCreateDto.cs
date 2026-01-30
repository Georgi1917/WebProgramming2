using System;

namespace Common.Infrastructure.SongDTOs;

public class SongCreateDto
{

    public string Title { get; set; }
    public int DurationInSeconds { get; set; }
    public int AlbumId { get; set; }

}
