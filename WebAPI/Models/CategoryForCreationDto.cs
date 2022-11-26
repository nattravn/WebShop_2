using System.Collections.Generic;

namespace WebAPI.Models
{
    public class CategoryForCreationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Route { get; set; }
        public ICollection<SubCategoryForCreationDto> SubCategories { get; set; } = new List<SubCategoryForCreationDto>();
    }
}

