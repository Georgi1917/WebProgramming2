using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Album : BaseEntity
{

    public string Title { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int ArtistId { get; set; }
    public Artist Artist { get; set; }
    public List<Song> Songs { get; set; }

}
