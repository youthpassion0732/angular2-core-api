using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace DomainEntities
{
    public class User : IdentityUser
    {
        [Required]
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Country { get; set; }
    }
}
