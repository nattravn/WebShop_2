using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UserApi.Entities;
using UserApi.Models;
using UserApi.ResourceParameters;

namespace UserApi.Services
{
    public interface IApplicationUserRepository
    {
        IEnumerable<ApplicationUser> GetUsers();

        IEnumerable<ApplicationUser> GetUsers(IEnumerable<String> ids);

        IEnumerable<ApplicationUser> GetUsers(UsersResourceParameters usersResourceParameters);

        ApplicationUser GetUser(string id);

        Task<GetTableListResponseDto<ApplicationUserDto>> GetUsersWithParams(
            int limit, 
            int page,
            string key,
            string direction,
            string SearchQuery,
            CancellationToken cancellationToken
        );

        void updateApplicationUser(string RoleName, string userId);

        void updateApplicationUserRole(string roleId, string userId);

        void AddUser(ApplicationUser userToAdd);

        void DeleteUser(ApplicationUser applicationUser);

        Task<bool> SaveChangesAsync { get; }

        bool UserExists(string userId);

        bool Save();

        IEnumerable<IdentityRole> GetRoles();

        IdentityRole getRole(string roleName);
    }
}
