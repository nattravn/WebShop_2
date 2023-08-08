using System;

namespace WebAPI.Models
{
    public class BaseProduct
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public byte[] Image { get; set; }
        //public byte[] Image { get; set; }
        public string ImagePath { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public int SubCategoryId { get; set; }
        public string CategoryName { get; set; }
        public string EditorUserId { get; set; }
        public string CreatorUserId { get; set; }
        public DateTime? LastUpdatedTime { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }
}
