using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using UserApi.Entities;
using UserApi.Extensions;
using UserApi.Filter;
using UserApi.Models;
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

            _context.Users.Add(userToAdd);
        }

        public ApplicationUser GetUser(string userId)
        {
            if (userId == string.Empty)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            return _context.Users.Where(a => a.Id == userId).FirstOrDefault();
        }

        public IEnumerable<ApplicationUser> GetUsers()
        {
            return _context.Users.ToList<ApplicationUser>();
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

            var collection = _context.Users as IQueryable<ApplicationUser>;

            if (!string.IsNullOrWhiteSpace(usersResourceParameters.UserName))
            {
                var userName = usersResourceParameters.UserName.Trim();
                collection = _context.Users.Where(a => a.UserName == userName);
            }

            if (!string.IsNullOrWhiteSpace(usersResourceParameters.SearchQuery))
            {
                var searchQuery = usersResourceParameters.SearchQuery.Trim();
                collection = _context.Users.Where(a => a.UserName.Contains(searchQuery)
                    || a.FullName.Contains(searchQuery)
                    || a.Id.Equals(searchQuery)
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

            return _context.Users.Any(a => a.Id == userId);
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

            return _context.Users.Where(a => userId.Contains(a.Id))
                .OrderBy(a => a.UserName)
                .ToList();
        }

        public void DeleteUser(ApplicationUser applicationUser)
        {
            if (applicationUser == null)
            {
                throw new ArgumentNullException(nameof(applicationUser));
            }

            _context.Users.Remove(applicationUser);
        }

        public void updateApplicationUser(string RoleName, string userId)
        {
            var roleId = getRole(RoleName);
            updateApplicationUserRole(roleId.Id, userId);
        }

        public async Task<GetTableListResponseDto<ApplicationUserDto>> GetUsersWithParams(
            int limit, 
            int page,
            string key,
            string order,
            string search,
            CancellationToken cancellationToken)
        {
            //Alternative way to fetch data using PaginatedList class
            //var users = await PaginatedList<ApplicationUser>.CreateAsync(
            //    _context.ApplicationUsers.AsNoTracking()
            //    .OrderByMember(key, order == "desc"), 
            //    page, 
            //    limit
            //);

            var searchQuery = "";

            if (!string.IsNullOrEmpty(search))
            {
                searchQuery = search.Trim().ToLower(CultureInfo.CurrentCulture);
            }


            var columnProperty = typeof(ApplicationUserDto).GetProperty(key, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);

            if (columnProperty == null)
            {
                return new GetTableListResponseDto<ApplicationUserDto> { CurrentPage = 0 };
            }

            //var roles = _context.UserRoles.AsNoTracking();

            //var users = await _context.Users
            //                        .AsNoTracking()
            //                        .WhereIf(string.IsNullOrEmpty(searchQuery), a => a.Email.Contains(searchQuery)
            //                            || a.FullName.Contains(searchQuery)
            //                            || a.Id.Equals(searchQuery))
            //                        .OrderByMember(key, order == "desc")
            //                        .PaginateAsync(page, limit, cancellationToken);


            var userRoles = _context.UserRoles.AsNoTracking();
            var roles = _context.Roles.AsNoTracking();

            var usersQuery = _context.Users
                .AsNoTracking()
                .WhereIf(string.IsNullOrEmpty(searchQuery), a => a.Email.Contains(searchQuery)
                                                                || a.FullName.Contains(searchQuery)
                                                                || a.Id == searchQuery).OrderByMember(key, order == "desc");

            var users = await usersQuery
                .Select(user => new
                {
                    User = user,
                    RoleName = roles.Where(role => role.Id == userRoles.Where(userRole => userRole.UserId == user.Id).FirstOrDefault().RoleId).FirstOrDefault().Name
                })
                .PaginateAsync(page, limit, cancellationToken);

            // var role = await _context.AspNetUserRoles.AsNoTracking().Where()

            return new GetTableListResponseDto<ApplicationUserDto>
            {
                CurrentPage = users.CurrentPage,
                TotalPages = users.TotalPages,
                TotalItems = users.TotalItems,
                Items = users.Items.Select(p => new ApplicationUserDto
                {
                    Id = p.User.Id,
                    Email = p.User.Email,
                    UserName = p.User.UserName,
                    FullName = p.User.FullName,
                    RoleName = p.RoleName
                }).ToList()
            };
        }

        public IEnumerable<IdentityRole> GetRoles()
        {
            return _context.Roles
                .OrderBy(a => a.Name)
                .ToList();
        }

        public void updateApplicationUserRole(string roleId, string userId)
        {
            var userRole = _context.UserRoles.Where(x => x.UserId == userId).FirstOrDefault();

            if (userRole != null)
            {
                _context.UserRoles.Remove(userRole);
            } 
            _context.UserRoles.Add(new IdentityUserRole<string> { RoleId = roleId, UserId = userId }); ;

            _context.SaveChanges();
        }

        public IdentityRole getRole(string roleName)
        {
            return _context.Roles.Where(x => x.Name == roleName).FirstOrDefault();
        }
    }
}
