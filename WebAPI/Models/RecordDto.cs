using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class RecordDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Band { get; set; }
        public string Album { get; set; }
        public string Year { get; set; }
        public string Genre { get; set; }
        //public byte[] Image { get; set; }
        public string ImagePath { get; set; }
        public float Price { get; set; }
        public int CategoryId { get; set; }
        public int subCategoryId { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
    }
}
