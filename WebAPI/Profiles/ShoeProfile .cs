using AutoMapper;

namespace WebAPI
{
    public class FlagProfile : Profile
    {
        public FlagProfile()
        {
            CreateMap<Entities.Shoe, Models.ShoeDto>();
            CreateMap<Models.ShoeForCreationDto, Entities.Shoe>();
        }
    }
}
