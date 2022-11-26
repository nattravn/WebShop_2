using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI
{
    public class RecordsProfile : Profile
    {
        public RecordsProfile()
        {
            CreateMap<Entities.Record, Models.RecordDto>();
            CreateMap<Models.RecordForCreationDto, Entities.Record>();
        }
        
    }
}
