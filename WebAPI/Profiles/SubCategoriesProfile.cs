using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI
{
    public class SubCategoriesProfile : Profile
    {
        public SubCategoriesProfile()
        {
            CreateMap<Entities.SubCategory, Models.SubCategoryDto>();
            CreateMap<Models.SubCategoryForCreationDto, Entities.SubCategory>();
            CreateMap<Entities.SubCategory, Models.SubCategoryForCreationDto > ();
        }
        
    }
}
