using Common.Entities;
using Common.Infrastructure.ArtistDTOs;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        
        private readonly ArtistServices _services;

        public ArtistsController(ArtistServices services)
        {
            
            _services = services;

        }

        [HttpGet]
        public IActionResult Get()
        {
            
            return Ok(_services.GetAll());

        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get(int id)
        {
            
            ArtistReadDto item = _services.GetById(id);
            return Ok(item);

        }
        [HttpPost]
        public IActionResult Post([FromBody] ArtistCreateDto item)
        {
            
            _services.Save(item);
            return Ok(item);

        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put(int id, [FromBody] ArtistCreateDto item)
        {
            
            bool updated = _services.Update(id, item);

            if (!updated) return NotFound();

            return Ok(item);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int id)
        {

            ArtistReadDto forDelete = _services.GetById(id);
            _services.Delete(id);

            return Ok(forDelete);

        }

    }
}
