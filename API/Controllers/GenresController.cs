using Common.Infrastructure.GenreDTOs;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GenresController : ControllerBase
    {
        
        private readonly GenreService _service;

        public GenresController(GenreService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get()
        {
            
            return Ok(_service.Get());

        }

        [HttpGet]
        [Route("{id}")]
        [AllowAnonymous]
        public IActionResult Get([FromRoute] int id)
        {
            
            return Ok(_service.GetById(id));

        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] GenreBaseDto dto)
        {
            
            _service.Save(dto);

            return Ok(dto);

        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute] int id, [FromBody] GenreBaseDto dto)
        {
            
            bool updated = _service.Update(id, dto);

            if (!updated) return NotFound();

            return Ok(dto);

        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete([FromRoute] int id)
        {
            
            _service.Delete(id);

            return Ok();

        }

    }
}
