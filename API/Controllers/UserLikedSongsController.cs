using System.Security.Claims;
using Common.Infrastructure.UserLikedSongsDTOs;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLikedSongsController : ControllerBase
    {
        
        private readonly UserLikedSongsService _service;

        public UserLikedSongsController(UserLikedSongsService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("{userId}")]
        public IActionResult Get([FromRoute]int userId)
        {
            
            return Ok(_service.GetLikedSongsByUser(userId));

        }

        [HttpPost]
        public IActionResult Post([FromBody] UserLikedSongsBaseDto dto)
        {

            string userId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null || Convert.ToInt32(userId) != dto.UserId)
                return Unauthorized();
            
            _service.Save(dto);

            return Ok(dto);

        }

        [HttpDelete]
        [Route("{userId}/song/{songId}")]
        public IActionResult Delete(int userId, int songId)
        {
            
            string loggedInId = this.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (loggedInId == null || Convert.ToInt32(loggedInId) != userId)
                return Unauthorized();

            _service.Delete(userId, songId);

            return Ok();

        }

    }
}
