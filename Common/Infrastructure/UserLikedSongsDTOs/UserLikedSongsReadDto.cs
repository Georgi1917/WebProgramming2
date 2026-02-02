using System;
using Common.Infrastructure.SongDTOs;

namespace Common.Infrastructure.UserLikedSongsDTOs;

public class UserLikedSongsReadDto : UserLikedSongsBaseDto
{

    public DateTime AddedAt { get; set; }
    public SongReadDto Song { get; set; }

}
