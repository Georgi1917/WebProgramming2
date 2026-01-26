using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Services;
using Common.Entities;
using Common.Infrastructure.AuthDTOs;
using Common.Services;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly UserServices _services;
        private readonly TokenService _tokenServices;

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            
            using var hmac = new HMACSHA512(storedSalt);

            var computeHash = hmac.ComputeHash(
                Encoding.UTF8.GetBytes(password)
            );

            return computeHash.SequenceEqual(storedHash);

        }

        public AuthController(UserServices services, TokenService tokenService)
        {
            _services      = services;
            _tokenServices = tokenService;
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody]LoginDto dto)
        {
            
            User user = _services.GetByUsername(dto.Username);

            if (user == null)
                return Unauthorized();

            bool isValid = VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt);

            if (!isValid)
                return Unauthorized();

            string token = _tokenServices.CreateToken(user);

            return Ok(new
            {
                token = token
            });


        }

        [HttpPost]
        [Route("Register")]
        public IActionResult Register([FromBody]RegisterDto dto)
        {
            
            User user = _services.GetByUsername(dto.Username);

            if (user != null)
                return BadRequest();

            _services.Save(dto);

            return Ok();

        }

    }
}
