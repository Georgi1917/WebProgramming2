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
        
        [HttpGet]
        public IActionResult Get()
        {
            
            UserServices services = new UserServices();
            return Ok(services.GetAll());

        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get(int id)
        {
            
            UserServices services = new UserServices();
            User user = services.GetById(id);
            return Ok(user);

        }
        [HttpPost]
        public IActionResult Post([FromBody] User user)
        {
            
            UserServices services = new UserServices();
            services.Save(user);
            return Ok(user);

        }

        [HttpPost]
        [Route("{id}")]
        public IActionResult Put(int id, [FromBody] User user)
        {
            
            UserServices services = new UserServices();
            User forUpdate = services.GetById(id);

            forUpdate.Username = user.Username;
            forUpdate.Email    = user.Email;
            forUpdate.Password = user.Password;

            services.Save(forUpdate);

            return Ok(forUpdate);

        }

        [HttpPost]
        [Route("delete/{id}")]
        public IActionResult Delete(int id)
        {

            UserServices services = new UserServices();
            User forDelete = services.GetById(id);
            services.Delete(id);

            return Ok(forDelete);

        }
        
    }
}
