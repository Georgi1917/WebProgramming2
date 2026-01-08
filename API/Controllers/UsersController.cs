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

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            
            UserServices services = new UserServices();
            User user = services.GetById(id);
            return Ok(user);

        }
    }
}
