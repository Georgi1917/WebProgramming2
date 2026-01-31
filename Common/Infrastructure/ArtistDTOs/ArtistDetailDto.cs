using System;
using System.Collections.Generic;
using Common.Infrastructure.AlbumDTOs;

namespace Common.Infrastructure.ArtistDTOs;

public class ArtistDetailDto : ArtistReadDto
{

    public List<AlbumReadDto> Albums { get; set; }

}
