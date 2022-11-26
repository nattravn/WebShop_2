namespace WebAPI.Models
{
    public class SubCategoryForCreationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Route { get; set; }
        public int CategoryId { get; set; }
    }
}
