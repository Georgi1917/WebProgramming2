using Common.Entities;
using Common.Infrastructure.PlaylistDTOs;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        
        private readonly PlaylistServices _service;

        public PlaylistsController(PlaylistServices services)
        {
            
            _service = services;

        }

        [HttpGet]
        public IActionResult Get(int userId)
        {
            
            Console.WriteLine(userId);
            return Ok(_service.Get(userId));

        }

        [HttpGet]
        [Route("{playlistId}")]
        public IActionResult Get(int userId, int playlistId)
        {
            
            return Ok(_service.GetById(userId, playlistId));

        }

        [HttpPost]
        public IActionResult Post(int userId, [FromBody]PlaylistCreateDto playlist)
        {
            
            _service.Save(userId, playlist);
            return Ok(playlist);

        }

        [HttpPut]
        [Route("{playlistId}")]
        public IActionResult Put(int userId, int playlistId, [FromBody]PlaylistCreateDto playlist)
        {
            
            _service.Update(userId, playlistId, playlist);
            return Ok(playlist);

        }

        [HttpDelete]
        [Route("{playlistId}")]
        public IActionResult Delete(int userId, int playlistId)
        {
            
            PlaylistReadDto forDelete = _service.GetById(userId, playlistId);
            _service.Delete(userId, playlistId);
            return Ok(forDelete);

        }

    }
}
