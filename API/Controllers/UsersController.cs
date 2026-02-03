using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Common.Entities;
using Common.Services;
using Common.Infrastructure.UserDTOs;
using Common.Infrastructure.AuthDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        
        private readonly UserServices _services;

        public UsersController(UserServices services)
        {
            
            _services = services;

        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult Get()
        {
            
            return Ok(_services.GetAll());

        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Get([FromRoute]int id)
        {
            
            UserReadDto user = _services.GetById(id);
            return Ok(user);

        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] UserCreateDto dto)
        {
            
            _services.Save(dto);
            return Ok(dto);

        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromRoute]int id, [FromBody] UserUpdateDto user)
        {
            
            _services.Update(id, user);

            return Ok(user);

        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete([FromRoute]int id)
        {

            UserReadDto forDelete = _services.GetById(id);
            _services.Delete(id);

            return Ok(forDelete);

        }
        
    }
}
