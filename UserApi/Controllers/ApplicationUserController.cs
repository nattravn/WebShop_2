using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using UserApi.Entities;
using UserApi.Models;
using UserApi.ResourceParameters;
using UserApi.Services;
using static Microsoft.AspNetCore.Http.StatusCodes;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using WebAPI.ResourceParameters;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationSettings _appSettings;
        private readonly IApplicationUserRepository _userRepository;
        private readonly IMapper _mapper;

        public ApplicationUserController(
            //IUserRepository userRepository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<ApplicationSettings> appSettings,
            IApplicationUserRepository userRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _userRepository = userRepository ??
               throw new ArgumentNullException(nameof(userRepository));

        }

        // GET: api/ApplicationUser
        [HttpGet()]
        [HttpHead]
        [Authorize(Roles = "Admin")]
        public ActionResult<IEnumerable<ApplicationUserDto>> GetAspNetUsers([FromQuery] UsersResourceParameters usersResourceParameters)
        {
            var userEntity = _userRepository.GetUsers(usersResourceParameters);

            var test = _mapper.Map<IEnumerable<ApplicationUserDto>>(userEntity);
            return Ok(_mapper.Map<IEnumerable<ApplicationUserDto>>(userEntity));
        }

        // GET: api/ApplicationUser/GetPagedUsers
        [HttpGet("GetPagedUsers", Name = "GetUserListAsync")]
        [ProducesResponseType(typeof(GetTableListResponseDto<ApplicationUserDto>), Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), Status400BadRequest)]
        public async Task<IActionResult> GetRecordListAsync(
            [FromQuery] UrlQueryParameters urlQueryParameters,
            CancellationToken cancellationToken)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            // https://vmsdurano.com/asp-net-core-5-implement-web-api-pagination-with-hateoas-links/
            var users = await _userRepository.GetUsersWithParams(
                                    urlQueryParameters.Limit,
                                    urlQueryParameters.Page,
                                    urlQueryParameters.Key,
                                    urlQueryParameters.Order,
                                    urlQueryParameters.SearchQuery,
                                    cancellationToken);

            return Ok(users);
        }


        // GET: api/ApplicationUser/5
        [HttpGet("{userId}", Name = "GetUser")]
        public async Task<IActionResult> GetAspNetUserAsync(string userId)
        {
            // Alternative way of getting a user using the _userManager
            ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, userId)
            });
            
            claimsPrincipal.AddIdentity(claimsIdentity);
            ApplicationUser user = await _userManager.GetUserAsync(claimsPrincipal);

            // Get user using repository
            ApplicationUser userEntity = _userRepository.GetUser(userId);

            if (!_userRepository.UserExists(userId))
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ApplicationUserDto>(userEntity));
        }

        // GET: api/ApplicationUser/roles
        [HttpGet("roles", Name = "GetRoles")]
        public async Task<IActionResult> GetAspNetRoles()
        {
            // Alternative way of getting a user using the _userManager

            IEnumerable<IdentityRole> roles = _userRepository.GetRoles();



            return Ok(roles);
        }


        [HttpPost]
        [Route("Register")]
        //POST : api/ApplicationUser/Register
        public async Task<Object> CreateApplicationUser(ApplicationUserForCreationDto model)
        {
            model.RoleName = "Customer";

            var applicationUser = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                await _userManager.AddToRoleAsync(applicationUser, model.RoleName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        [HttpPost]
        [Route("Login")]
        //POST : /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                //Get role assigned to user
                var role = await _userManager.GetRolesAsync(user);
                IdentityOptions _options = new IdentityOptions();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType,role.FirstOrDefault())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                return Ok(new { token });
            }
            else
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }
        }

        [HttpOptions]
        public IActionResult GetApplicationUsersOptions()
        {
            Response.Headers.Add("Allow", "GET,OPTIONS,POST");
            return Ok();
        }

        [HttpPut("{applicationUserId}")]
        public IActionResult UpadteCourseAuthor(
            string applicationUserId, 
            ApplicationUserForCreationDto applicationUser)
        {
            if (!_userRepository.UserExists(applicationUserId))
            {
                return NotFound();
            }

            var applicationUserFromRepo = _userRepository.GetUser(applicationUserId);

            if (applicationUserFromRepo == null)
            {
                var applicationUserToAdd = _mapper.Map<ApplicationUser>(applicationUser);

                _userRepository.AddUser(applicationUserToAdd);

                _userRepository.Save();

                var applicationUserToReturn = _mapper.Map<ApplicationUserDto>(applicationUserToAdd);

                return CreatedAtRoute("GetUser", new { userId = applicationUserToReturn.Id }, applicationUserToReturn);
            }

            _mapper.Map(applicationUser, applicationUserFromRepo);

            _userRepository.updateApplicationUser(applicationUser.RoleName, applicationUserFromRepo.Id);
            

            _userRepository.Save();

            var applicationUserToReturn1 = _mapper.Map<ApplicationUserDto>(applicationUserFromRepo);
            applicationUserToReturn1.RoleName = applicationUser.RoleName;
            return CreatedAtRoute("GetUser", new { userId = applicationUserFromRepo.Id }, applicationUserToReturn1);

        }

        [HttpPatch("{applicationUserId}")]
        public ActionResult PartiallyUpdateApplicationUser(
            string applicationUserId,
            JsonPatchDocument<ApplicationUserForUpdateDto> patchDocument)
        {
            if (!_userRepository.UserExists(applicationUserId))
            {
                return NotFound();
            }

            var applicationUserFromRepo = _userRepository.GetUser(applicationUserId);

            if (applicationUserFromRepo == null)
            {
                var applicationUserDto = new ApplicationUserForUpdateDto();
                patchDocument.ApplyTo(applicationUserDto, ModelState);

                if (!TryValidateModel(applicationUserDto))
                {
                    return ValidationProblem(ModelState);
                }

                var applicationUserToAdd = _mapper.Map<Entities.ApplicationUser>(applicationUserDto);
                applicationUserToAdd.Id = applicationUserId;

                _userRepository.AddUser(applicationUserToAdd);
                _userRepository.Save();

                var applicationUserToReturn = _mapper.Map<ApplicationUserDto>(applicationUserToAdd);

                return CreatedAtRoute("GetUser",
                    new { applicationUserId = applicationUserToReturn.Id },
                    applicationUserToReturn);
            }

            var applicationUserToPath = _mapper.Map<ApplicationUserForUpdateDto>(applicationUserFromRepo);
            // add validation
            patchDocument.ApplyTo(applicationUserToPath, ModelState);

            if(!TryValidateModel(applicationUserToPath))
            {
               return ValidationProblem(ModelState);
            }
            
            _mapper.Map(applicationUserToPath, applicationUserFromRepo);

            var applicationUserToPathConverted = _mapper.Map<ApplicationUserForCreationDto>(applicationUserFromRepo);
            _userRepository.updateApplicationUser(applicationUserToPathConverted.RoleName, applicationUserFromRepo.Id);

            _userRepository.Save();

            return NoContent();
        }

        public override ActionResult ValidationProblem(
            [ActionResultObjectValue] ModelStateDictionary modelStateDictionary)
        {
            var options = HttpContext.RequestServices
                .GetRequiredService<IOptions<ApiBehaviorOptions>>();
            return (ActionResult)options.Value.InvalidModelStateResponseFactory(ControllerContext);
        }

       // DELETE: api/AspNetUsers/5
        [HttpDelete("{id}")]
        public ActionResult DeleteApplicationUser(string id)
        {
            if(!_userRepository.UserExists(id))
            {
                return NotFound();
            }

            var userRepositoryFromRepo = _userRepository.GetUser(id);

            if(userRepositoryFromRepo == null)
            {
                return NotFound();
            }

            _userRepository.DeleteUser(userRepositoryFromRepo);
            _userRepository.Save();

            return NoContent();
        }
    }
}
