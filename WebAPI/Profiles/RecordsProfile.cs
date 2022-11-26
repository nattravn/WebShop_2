using AutoMapper;

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
