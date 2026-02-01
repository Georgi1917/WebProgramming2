using System;

namespace Common.Entities;

public class PlaylistSongs : BaseEntity
{

    public int PlaylistId { get; set; }
    public Playlist Playlist { get; set; }
    public int SongId { get; set; }
    public Song Song { get; set; }
    public int Position { get; set; }
    public DateTime AddedAt { get; set; }

}
