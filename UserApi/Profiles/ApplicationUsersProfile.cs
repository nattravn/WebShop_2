using AutoMapper;

namespace UserApi.Profiles
{
    public class ApplicationUsersProfile : Profile
    {
        public ApplicationUsersProfile()
        {
            CreateMap<Entities.ApplicationUser, Models.ApplicationUserDto>();
            CreateMap<Models.ApplicationUserForCreationDto, Entities.ApplicationUser>();
            CreateMap<Models.ApplicationUserForUpdateDto, Entities.ApplicationUser>();
            CreateMap<Entities.ApplicationUser, Models.ApplicationUserForUpdateDto>();
        }
    }
}
