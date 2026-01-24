using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Common.Entities;
using Common.Services;
using Common.Infrastructure.UserDTOs;
using Common.Infrastructure.AuthDTOs;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        
        private readonly UserServices _services;

        public UsersController(UserServices services)
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
            
            UserReadDto user = _services.GetById(id);
            return Ok(user);

        }
        [HttpPost]
        public IActionResult Post([FromBody] RegisterDto user)
        {
            
            _services.Save(user);
            return Ok(user);

        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put(int id, [FromBody] UserUpdateDto user)
        {
            
            _services.Update(id, user);

            return Ok(user);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int id)
        {

            UserReadDto forDelete = _services.GetById(id);
            _services.Delete(id);

            return Ok(forDelete);

        }
        
    }
}
