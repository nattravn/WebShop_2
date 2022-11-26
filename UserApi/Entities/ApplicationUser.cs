using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace UserApi.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string FullName { get; set; }
    }
}
