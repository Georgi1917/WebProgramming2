using System;
using System.Collections.Generic;
using Common.Infrastructure.SongDTOs;

namespace Common.Infrastructure.AlbumDTOs;

public class AlbumDetailDto : AlbumReadDto
{

    public List<SongReadDto> Songs { get; set; }

}
