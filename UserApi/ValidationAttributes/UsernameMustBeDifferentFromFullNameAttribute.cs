using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Models;

namespace UserApi.ValidationAttributes
{
    public class UsernameMustBeDifferentFromFullNameAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, 
            ValidationContext validationContext)
        {
            var applicationUser = (ApplicationUserForManipulationDto)validationContext.ObjectInstance;
            
            if(applicationUser.FullName == applicationUser.UserName)
            {
                return new ValidationResult(ErrorMessage,
                    new[] { nameof(ApplicationUserForCreationDto) });
            }

            return ValidationResult.Success;
        }
    }
}
