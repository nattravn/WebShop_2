using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Entities;
using UserApi.ResourceParameters;

namespace UserApi.Services
{
    public class ApplicationUserRepository : IApplicationUserRepository
    {
        public Task<bool> SaveChangesAsync => throw new NotImplementedException();
        private readonly AuthenticationContext _context;


        public ApplicationUserRepository(AuthenticationContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public void AddUser(ApplicationUser userToAdd)
        {
            if (userToAdd == null)
            {
                throw new ArgumentNullException(nameof(userToAdd));
            }

            _context.ApplicationUsers.Add(userToAdd);
        }

        public ApplicationUser GetUser(string userId)
        {
            if (userId == string.Empty)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            return _context.ApplicationUsers.Where(a => a.Id == userId).FirstOrDefault();
        }

        public IEnumerable<ApplicationUser> GetUsers()
        {
            return _context.ApplicationUsers.ToList<ApplicationUser>();
        }

        public IEnumerable<ApplicationUser> GetUsers(UsersResourceParameters usersResourceParameters)
        {
            if (usersResourceParameters == null)
            {
                throw new ArgumentNullException(nameof(usersResourceParameters));
            }

            if (string.IsNullOrWhiteSpace(usersResourceParameters.UserName)
                    && string.IsNullOrWhiteSpace(usersResourceParameters.SearchQuery))
            {
                return GetUsers();
            }

            var collection = _context.ApplicationUsers as IQueryable<ApplicationUser>;

            if (!string.IsNullOrWhiteSpace(usersResourceParameters.UserName))
            {
                var userName = usersResourceParameters.UserName.Trim();
                collection = _context.ApplicationUsers.Where(a => a.UserName == userName);
            }

            if (!string.IsNullOrWhiteSpace(usersResourceParameters.SearchQuery))
            {
                var searchQuery = usersResourceParameters.SearchQuery.Trim();
                collection = _context.ApplicationUsers.Where(a => a.UserName.Contains(searchQuery)
                    || a.Email.Contains(searchQuery));
            }

            return collection.ToList();
        }

        public bool UserExists(string userId)
        {
            if (userId == string.Empty)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            return _context.ApplicationUsers.Any(a => a.Id == userId);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // dispose resources when needed
            }
        }

        public IEnumerable<ApplicationUser> GetUsers(IEnumerable<string> userId)
        {
            if (userId == null)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            return _context.ApplicationUsers.Where(a => userId.Contains(a.Id))
                .OrderBy(a => a.UserName)
                .ToList();
        }

        public void DeleteUser(ApplicationUser applicationUser)
        {
            if (applicationUser == null)
            {
                throw new ArgumentNullException(nameof(applicationUser));
            }

            _context.ApplicationUsers.Remove(applicationUser);
        }

        public void updateApplicationUser(ApplicationUser userToUpdate)
        {
            // no code in this implementation
        }
    }
}
