using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Entities;
using UserApi.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private readonly IApplicationUserRepository _applicationUserRepository;
        public UserProfileController(
            UserManager<ApplicationUser> userManager,
            IApplicationUserRepository applicationUserRepository)
        {
            _userManager = userManager;
            _applicationUserRepository = applicationUserRepository ??
               throw new ArgumentNullException(nameof(applicationUserRepository));
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Customer")]
        //GET : /api/UserProfile
        public async Task<Object> GetUserProfile()
        {
            var accessToken = Request.Headers[HeaderNames.Authorization];
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.FullName,
                user.Email,
                user.UserName,
                userId
            };
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Customer")]
        [Route("getUserToken")]
        public async Task<IActionResult> getUserToken()
        {
            string accessToken = "unassigned";


            accessToken = Request.Headers[HeaderNames.Authorization];

            if (accessToken == null)
            {
                await Task.Delay(500);
                return new StatusCodeResult(500);
            }

            return Ok(new { Token = accessToken });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("ForAdmin")]
        public string GetForAdmin()
        {
            return "Web method for Admin";
        }

        [HttpGet]
        [Authorize(Roles = "Customer")]
        [Route("ForCustomer")]
        public string GetCustomer()
        {
            return "Web method for Customer";
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Customer")]
        [Route("ForAdminOrCustomer")]
        public string GetForAdminOrCustomer()
        {
            return "Web method for Admin or Customer";
        }
    }
}