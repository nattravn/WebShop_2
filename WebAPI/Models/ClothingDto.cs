using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ClothingDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public byte[] Image { get; set; }
        public string ImagePath { get; set; }
        public double Price { get; set; }
        public string Size { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public int SubCategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
