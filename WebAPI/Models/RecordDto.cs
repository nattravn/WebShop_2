using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class RecordDto
    {
        public int Id { get; set; }
        public string EditorUserId { get; set; }
        public string CreatorUserId { get; set; }
        public string Title { get; set; }
        public string Band { get; set; }
        public string Album { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string Genre { get; set; }
        //public byte[] Image { get; set; }
        public string ImagePath { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public int subCategoryId { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
        public DateTime? LastUpdatedTime { get; set; }
    }
}
