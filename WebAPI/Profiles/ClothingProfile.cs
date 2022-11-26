using AutoMapper;

namespace WebAPI
{
    public class ClothingProfile : Profile
    {
        public ClothingProfile()
        {
            CreateMap<Entities.Clothing, Models.ClothingDto>();
            CreateMap<Models.ClothingForCreationDto, Entities.Clothing>();
        }

    }
}
