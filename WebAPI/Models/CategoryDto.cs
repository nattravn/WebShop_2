using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public partial class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Route { get; set; }
        public bool Implemented { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; } = new List<SubCategoryDto>();
    }
}
