using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ClothingForCreationDto
    {
        public string Title { get; set; }
        public IFormFile ImageFile { get; set; }
        public string ImagePath { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
    }
}
