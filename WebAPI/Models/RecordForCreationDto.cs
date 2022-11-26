using Microsoft.AspNetCore.Http;

namespace WebAPI.Models
{
    public class RecordForCreationDto
    {
        public string Title { get; set; }
        public string Band { get; set; }
        public string Album { get; set; }
        public string Year { get; set; }
        public string Genre { get; set; }
        public IFormFile ImageFile { get; set; }
        public string ImagePath { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
    }
}
