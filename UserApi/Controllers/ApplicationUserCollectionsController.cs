using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using UserApi.Helpers;
using UserApi.Models;
using UserApi.Services;

namespace UserApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationUserCollectionsController : ControllerBase
    {
        private readonly IApplicationUserRepository _userRepository;
        private readonly IMapper _mapper;

        public ApplicationUserCollectionsController(IApplicationUserRepository userRepository,
            IMapper mapper)
        {
            _userRepository = userRepository ??
                throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ??
                throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet("({ids})", Name = "GetApplicationUserCollection")]
        public IActionResult GetApplicationUserCollection(
        [FromRoute] 
        [ModelBinder(BinderType = typeof(ArrayModelBinder))] IEnumerable<String> ids)
        { 
            if(ids == null)
            {
                return BadRequest();
            }

            var applicationUserEntities = _userRepository.GetUsers(ids);

            if (ids.Count() != applicationUserEntities.Count())
            {
                return NotFound();
            }

            var applicationUsersToReturn = _mapper.Map<IEnumerable<ApplicationUserDto>>(applicationUserEntities);

            return Ok(applicationUsersToReturn);
        }


        [HttpPost]
        public ActionResult<IEnumerable<ApplicationUserDto>> CreateAspNetUsersCollection(
            IEnumerable<ApplicationUserForCreationDto> applicationUserCollection)
        {
            var applicationUserEntities = _mapper.Map<IEnumerable<Entities.ApplicationUser>>(applicationUserCollection);
            foreach (var user in applicationUserEntities)
            {
                _userRepository.AddUser(user);
            }

            _userRepository.Save();

            var applicationUsersToReturn = _mapper.Map<IEnumerable<ApplicationUserDto>>(applicationUserEntities);
            var idsAsString = string.Join(",", applicationUsersToReturn.Select(a => a.Id));

            return CreatedAtRoute("GetApplicationUserCollection",
                new { ids = idsAsString },
                applicationUsersToReturn);
        }
    }
}
