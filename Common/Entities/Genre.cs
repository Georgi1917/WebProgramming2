using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Genre : BaseEntity
{

    public string Name { get; set; }
    public List<Song> Songs { get; set; }

}
