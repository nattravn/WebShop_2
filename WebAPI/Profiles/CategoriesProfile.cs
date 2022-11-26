using AutoMapper;

namespace WebAPI
{
    public class CategoriesProfile : Profile
    {
        public CategoriesProfile()
        {
            CreateMap<Entities.Category, Models.CategoryDto>();

            CreateMap<Models.CategoryForUpdateDto, Entities.Category>()
                .ForMember(d => d.SubCategories, opt => opt.Ignore());

            CreateMap<Models.CategoryForCreationDto, Entities.Category>();
        }
    }
}
