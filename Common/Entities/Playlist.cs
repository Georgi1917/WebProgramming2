using System;

namespace Common.Entities;

public class Playlist : BaseEntity
{

    public string Title { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }

}
