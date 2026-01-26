using Common.Data;
using Common.Infrastructure.AlbumDTOs;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumsController : ControllerBase
    {
        
        private readonly AlbumService _service;

        public AlbumsController(AlbumService service)
        {
            
            _service = service;

        }

        [HttpGet]
        public IActionResult Get()
        {
            
            return Ok(_service.GetAll());

        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(int id)
        {
            
            return Ok(_service.Get(id));

        }

        [HttpPost]
        public IActionResult Post(AlbumCreateDto dto)
        {
            
            _service.Save(dto);

            return Ok(dto);

        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put(int id, AlbumCreateDto dto)
        {
            
            _service.Update(id, dto);

            return Ok(dto);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int id)
        {
            
            AlbumReadDto forDelete = _service.Get(id);
            _service.Delete(id);

            return Ok(forDelete);

        }

    }
}
