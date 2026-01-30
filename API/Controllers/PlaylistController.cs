using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Common.Entities;
using Common.Infrastructure.PlaylistDTOs;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        
        private readonly PlaylistServices _service;

        public PlaylistsController(PlaylistServices services)
        {
            
            _service = services;

        }

        [HttpGet]
        public IActionResult Get()
        {
            
            string loggedUserId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (loggedUserId == null)
                return Unauthorized();

            return Ok(_service.Get(Convert.ToInt32(loggedUserId)));

        }

        [HttpGet]
        [Route("{playlistId}")]
        public IActionResult Get(int playlistId)
        {

            string loggedUserId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (loggedUserId == null)
                return Unauthorized();
            
            return Ok(_service.GetById(Convert.ToInt32(loggedUserId), playlistId));

        }

        [HttpPost]
        public IActionResult Post([FromBody]PlaylistCreateDto playlist)
        {

            string loggedUserId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (loggedUserId == null)
                return Unauthorized();
            
            _service.Save(Convert.ToInt32(loggedUserId), playlist);
            return Ok(playlist);

        }

        [HttpPut]
        [Route("{playlistId}")]
        public IActionResult Put(int playlistId, [FromBody]PlaylistCreateDto playlist)
        {

            string loggedUserId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (loggedUserId == null)
                return Unauthorized();
            
            _service.Update(Convert.ToInt32(loggedUserId), playlistId, playlist);
            return Ok(playlist);

        }

        [HttpDelete]
        [Route("{playlistId}")]
        public IActionResult Delete(int playlistId)
        {

            string loggedUserId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (loggedUserId == null)
                return Unauthorized();
            
            PlaylistReadDto forDelete = _service.GetById(Convert.ToInt32(loggedUserId), playlistId);

            _service.Delete(Convert.ToInt32(loggedUserId), playlistId);

            return Ok(forDelete);

        }

    }
}
