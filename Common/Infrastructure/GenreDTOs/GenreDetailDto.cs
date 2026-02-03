using System;
using System.Collections.Generic;
using Common.Infrastructure.SongDTOs;

namespace Common.Infrastructure.GenreDTOs;

public class GenreDetailDto : GenreBaseDto
{

    public int Id { get; set; }
    public List<SongReadDto> Songs { get; set; }

}
