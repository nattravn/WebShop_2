using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserApi.Entities
{
    [NotMapped]
    public class ApplicationUserToken : IdentityUserToken<string>
    {
    }
}
