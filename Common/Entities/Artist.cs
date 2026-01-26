using System;
using System.Collections.Generic;

namespace Common.Entities;

public class Artist : BaseEntity
{

    public string Name { get; set; }
    public string Country { get; set; }
    public List<Album> Albums { get; set; }

}
