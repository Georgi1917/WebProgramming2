using Common.Entities;
using Common.Infrastructure.ArtistDTOs;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ArtistsController : ControllerBase
    {
        
        private readonly ArtistServices _services;

        public ArtistsController(ArtistServices services)
        {
            
            _services = services;

        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get()
        {
            
            return Ok(_services.GetAll());

        }

        [HttpGet]
        [Route("{id}")]
        [AllowAnonymous]
        public IActionResult Get([FromRoute]int id)
        {
            
            ArtistReadDto item = _services.GetById(id);
            return Ok(item);

        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] ArtistCreateDto item)
        {
            
            _services.Save(item);
            return Ok(item);

        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute]int id, [FromBody] ArtistCreateDto item)
        {
            
            bool updated = _services.Update(id, item);

            if (!updated) return NotFound();

            return Ok(item);

        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete([FromRoute]int id)
        {

            ArtistReadDto forDelete = _services.GetById(id);
            _services.Delete(id);

            return Ok(forDelete);

        }

    }
}
