using System;
using System.Collections.Generic;

namespace Common.Entities;

public class User : BaseEntity
{

    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public List<Playlist> Playlists { get; set; }

}
