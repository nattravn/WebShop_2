using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using UserApi.ValidationAttributes;

namespace UserApi.Models
{
    [UsernameMustBeDifferentFromFullNameAttribute(
        ErrorMessage = "Username must be different from Fullname")]
    public abstract class ApplicationUserForManipulationDto
    {
        [Required(ErrorMessage = "You should fill out a UserName")]
        [MaxLength(100, ErrorMessage = "The UserName shouldn't have more than 1500 chracters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "You should fill out a Email")]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required(ErrorMessage = "You should fill out a Password")]
        [MaxLength(100)]
        public string Password { get; set; }

        [Required(ErrorMessage = "You should fill out a FullName")]
        [MaxLength(100)]
        public virtual string FullName { get; set; }

        [Required(ErrorMessage = "You should select a user role")]
        public string RoleName { get; set; }
    }
}
