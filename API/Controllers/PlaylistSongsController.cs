using System.Security.Claims;
using Common.Infrastructure.PlaylistSongsDTOs;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlaylistSongsController : ControllerBase
    {
        
        private readonly PlaylistSongsService _service;

        public PlaylistSongsController(PlaylistSongsService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get(int id)
        {
            
            string userId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            return Ok(_service.GetByPlaylist(id, Convert.ToInt32(userId)));

        }

        [HttpPost]
        public IActionResult Post([FromBody]BasePlaylistSongsDto dto)
        {

            string userId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();
            
            _service.Save(dto, Convert.ToInt32(userId));

            return Ok(dto);

        }

        [HttpDelete]
        [Route("{playlistId}/song/{songId}")]
        public IActionResult Delete(int playlistId, int songId)
        {

            string userId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();
            
            _service.RemoveSong(playlistId, songId, Convert.ToInt32(userId));

            return Ok();

        }

    }
}
