using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Common.Entities;
using Common.Services;

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
            
            User user = _services.GetById(id);
            return Ok(user);

        }
        [HttpPost]
        public IActionResult Post([FromBody] User user)
        {
            
            _services.Save(user);
            return Ok(user);

        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult Put(int id, [FromBody] User user)
        {
            
            User forUpdate = _services.GetById(id);

            forUpdate.Username = user.Username;
            forUpdate.Email    = user.Email;
            forUpdate.Password = user.Password;

            _services.Save(forUpdate);

            return Ok(forUpdate);

        }

        [HttpPost]
        [Route("delete/{id}")]
        public IActionResult Delete(int id)
        {

            User forDelete = _services.GetById(id);
            _services.Delete(id);

            return Ok(forDelete);

        }
        
    }
}
