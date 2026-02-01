using System;
using Common.Infrastructure.SongDTOs;

namespace Common.Infrastructure.PlaylistSongsDTOs;

public class PlaylistSongsReadDto : BasePlaylistSongsDto
{

    public DateTime AddedAt { get; set; }
    public int Position { get; set; }
    public SongReadDto Song { get; set; }

}
