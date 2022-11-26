using System.ComponentModel.DataAnnotations;

namespace UserApi.Models
{
    public class ApplicationUserForUpdateDto : ApplicationUserForManipulationDto
    {
        [Required(ErrorMessage = "You should fill out a FullName")]
        public override string FullName { get => base.FullName; set => base.FullName = value; }
    }
}
