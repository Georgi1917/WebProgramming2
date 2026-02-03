using System;
using System.Collections.Generic;

namespace Common.Entities;

public class User : BaseEntity
{

    public string Username { get; set; }
    public string Email { get; set; }
    public string Role { get; set; } = "User";
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public List<Playlist> Playlists { get; set; }
    public List<UserLikedSongs> LikedSongs { get; set; }

}
