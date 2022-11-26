using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace UserApi.Models
{
    public class ApplicationUserForUpdateDto : ApplicationUserForManipulationDto
    {
        [Required(ErrorMessage = "You should fill out a FullName")]
        public override string FullName { get => base.FullName; set => base.FullName = value; }
    }
}
