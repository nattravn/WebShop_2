using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserApi.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string FullName { get; set; }
    }
}
