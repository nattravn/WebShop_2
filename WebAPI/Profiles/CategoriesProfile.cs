using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Entities;

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
