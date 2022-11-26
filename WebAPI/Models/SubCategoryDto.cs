using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class SubCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Route { get; set; }
        public int CategoryId { get; set; }
    }
}
