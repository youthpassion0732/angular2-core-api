using DomainEntities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace DAL
{
    public interface IAuthRepository
    {
        Task<IdentityResult> CreateAsync(User user);

        Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure);
    }
}
