using System;

namespace Common.Entities;

public class UserLikedSongs : BaseEntity
{

    public int UserId { get; set; }
    public User User { get; set; }
    public int SongId { get; set; }
    public Song Song { get; set; }
    public DateTime AddedAt { get; set; }

}
