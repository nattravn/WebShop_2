using System.ComponentModel.DataAnnotations;

namespace UserApi.Models
{
    public class ApplicationUserModel
    {
        [Required(ErrorMessage = "You should fill out a UserName")]
        [MaxLength(100, ErrorMessage = "The UserName shouldn't have more than 100 chracters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "You should fill out a Email")]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required(ErrorMessage = "You should fill out a Password")]
        [MaxLength(100)]
        public string Password { get; set; }

        [Required(ErrorMessage = "You should not have more than 100 characters")]
        [MaxLength(100)]
        public string FullName { get; set; }

        public string Role { get; set; }
    }
}
