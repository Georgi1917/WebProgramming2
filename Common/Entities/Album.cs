using System;

namespace Common.Entities;

public class Album : BaseEntity
{

    public string Title { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ArtistId { get; set; }
    public Artist Artist { get; set; }

}
