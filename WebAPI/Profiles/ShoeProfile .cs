using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
