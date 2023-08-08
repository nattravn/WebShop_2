using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI
{
    public class ClothingProfile : Profile
    {
        public ClothingProfile()
        {
            CreateMap<Entities.Clothing, Models.ClothingDto>();
            CreateMap<Models.ClothingForCreationDto, Entities.Clothing>();
            CreateMap<Models.ClothingDto, Entities.Clothing>();
        }
        
    }
}
