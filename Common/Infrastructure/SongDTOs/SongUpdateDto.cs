using System;

namespace Common.Infrastructure.SongDTOs;

public class SongUpdateDto
{

    public string Title { get; set; }
    public int DurationInSeconds { get; set; }
    public int GenreId { get; set; }

}
