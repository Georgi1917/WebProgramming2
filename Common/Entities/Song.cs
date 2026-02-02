using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Song : BaseEntity
{

    public string Title { get; set; }
    public int DurationInSeconds { get; set; }
    public string FilePath { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
    public long Size { get; set; }
    public int AlbumId { get; set; }
    public Album Album { get; set; }

    public List<PlaylistSongs> PlaylistSongs { get; set; }
    public List<UserLikedSongs> LikedByUsers { get; set; }

}
