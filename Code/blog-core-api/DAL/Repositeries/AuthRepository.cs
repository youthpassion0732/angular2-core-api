using DomainEntities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace DAL
{
    public class AuthRepository : IAuthRepository
    {
        private readonly BlogContext dBContext;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public AuthRepository(BlogContext dbContext, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            this.dBContext = dbContext;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        public virtual Task<IdentityResult> CreateAsync(User user)
        {
            try
            {
                string password = user.PasswordHash;
                user.UserName = user.Email;

                // set it to null as identity will populate "PasswordHash" field itself
                user.PasswordHash = null;

                return userManager.CreateAsync(user, password);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public virtual Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure)
        {
            try
            {
                return signInManager.PasswordSignInAsync(userName, password, isPersistent, lockoutOnFailure);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
