using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Route { get; set; }
        public ICollection<SubCategoryDto> SubCategories { get; set; } = new List<SubCategoryDto>();
    }
}
