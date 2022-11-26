using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Entities;
using UserApi.ResourceParameters;

namespace UserApi.Services
{
    public interface IApplicationUserRepository
    {
        IEnumerable<ApplicationUser> GetUsers();

        IEnumerable<ApplicationUser> GetUsers(IEnumerable<String> ids);

        IEnumerable<ApplicationUser> GetUsers(UsersResourceParameters usersResourceParameters);

        ApplicationUser GetUser(string id);

        void updateApplicationUser(ApplicationUser userToUpdate);

        void AddUser(ApplicationUser userToAdd);

        void DeleteUser(ApplicationUser applicationUser);

        Task<bool> SaveChangesAsync { get; }

        bool UserExists(string userId);
        bool Save();
    }
}
