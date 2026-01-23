using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Common.Entities;
using Common.Infrastructure.AuthDTOs;
using Common.Services;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly IConfiguration _configuration;
        private readonly UserServices _services;

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            
            using var hmac = new HMACSHA512(storedSalt);

            var computeHash = hmac.ComputeHash(
                Encoding.UTF8.GetBytes(password)
            );

            return computeHash.SequenceEqual(storedHash);

        }

        public AuthController(IConfiguration configuration, UserServices services)
        {
            _configuration = configuration;
            _services      = services;
        }

        [HttpPost]
        [Route("/login")]
        public IActionResult Login(LoginDto dto)
        {
            
            User user = _services.GetByUsername(dto.Username);

            if (user == null)
                return Unauthorized();

            bool isValid = VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt);

            if (!isValid)
                return Unauthorized();

            Claim[] claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["Jwt:ExpireMinutes"])
                ),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256
                )
            );


            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });


        }

    }
}
