using Microsoft.AspNetCore.Http;

namespace WebAPI.Models
{
    public class ShoeForCreationDto
    {
        public string Title { get; set; }
        public IFormFile ImageFile { get; set; }
        public string ImagePath { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
    }
}
