using System.Threading.Tasks;
using System;
using System.IO;
using Common.Entities;
using Common.Infrastructure.SongDTOs;
using Common.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        
        private readonly SongService _service;
        private readonly string _mediaPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedMedia");

        public SongsController(SongService service)
        {

            _service = service;

            if (!Directory.Exists(_mediaPath)) Directory.CreateDirectory(_mediaPath);

        }

        [HttpGet]
        public IActionResult Get()
        {
            
            return Ok(_service.Get());

        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get([FromRoute]int id)
        {
            
            return Ok(_service.GetById(id));

        }

        [HttpGet]
        [Route("stream/{id}")]
        public IActionResult Stream([FromRoute]int id)
        {
            
            SongReadDto dto = _service.GetById(id);

            if (dto == null) return BadRequest();

            FileStream stream = new FileStream(dto.StreamUrl, FileMode.Open, FileAccess.Read);

            return File(stream, dto.ContentType, enableRangeProcessing: true);
            
        }

        [HttpPost]
        public async Task<IActionResult> Post(IFormFile file, [FromForm] SongCreateDto dto)
        {
            
            if (file == null || file.Length == 0) return BadRequest();

            string[] allowedExtensions = new[] { ".mp3", ".wav", ".aac" };

            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension)) return BadRequest();

            string safeFileName = $"{Guid.NewGuid()}{extension}";
            string filePath = Path.Combine(_mediaPath, safeFileName);

            using (FileStream stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            Song song = new Song
            {
                Title = dto.Title,
                DurationInSeconds = dto.DurationInSeconds,
                AlbumId = dto.AlbumId,
                FilePath = filePath,
                FileName = file.FileName,
                ContentType = file.ContentType,
                Size = file.Length
            };

            _service.Save(song);

            return Ok();

        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put([FromRoute]int id, [FromBody]SongUpdateDto dto)
        {
            
            _service.Update(id, dto);

            return Ok(dto);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute]int id)
        {
            
            SongReadDto needed = _service.GetById(id);

            if (System.IO.File.Exists(needed.StreamUrl))
                System.IO.File.Delete(needed.StreamUrl);

            _service.Delete(id);

            return Ok(needed);

        }

    }
}
