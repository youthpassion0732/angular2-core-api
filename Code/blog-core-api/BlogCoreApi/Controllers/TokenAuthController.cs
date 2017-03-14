using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using DomainEntities;
using DAL;
using System.Threading.Tasks;

namespace BlogCoreApi.Controllers
{
    [Route("api/[controller]")]
    public class TokenAuthController : Controller
    {
        private IAuthRepository authRepo;
        private IGenericRepositery<User> userRepo;

        public TokenAuthController(IGenericRepositery<User> userRepo,
                         IAuthRepository authRepo)
        {
            this.userRepo = userRepo;
            this.authRepo = authRepo;
        }

        // reference: https://code.msdn.microsoft.com/How-to-authorization-914d126b/sourcecode?fileId=163129&pathId=87568518
        [HttpPost]
        [AllowAnonymous]
        public async Task<string> Post([FromBody] User user)
        {
            try
            {
                var signinResult = await authRepo.PasswordSignInAsync(user.Email, user.PasswordHash, true, false);

                if (signinResult != null && signinResult.Succeeded)
                {
                    var loggedUser = userRepo.Get(x => x.Email == user.Email.Trim()).FirstOrDefault();

                    var requestAt = DateTime.Now;
                    var expiresIn = requestAt + TokenAuthOption.ExpiresSpan;
                    var token = GenerateToken(loggedUser, expiresIn);

                    return JsonConvert.SerializeObject(new RequestResult
                    {
                        State = RequestState.Success,
                        Data = new
                        {
                            requertAt = requestAt,
                            expiresIn = TokenAuthOption.ExpiresSpan.TotalSeconds,
                            tokeyType = TokenAuthOption.TokenType,
                            accessToken = token,
                            fullName = loggedUser.FirstName + " " + loggedUser.LastName
                        }
                    });
                }
                else
                {
                    return JsonConvert.SerializeObject(new RequestResult
                    {
                        State = RequestState.Failed,
                        Msg = "Username or password is invalid"
                    });
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GenerateToken(User user, DateTime expires)
        {
            var handler = new JwtSecurityTokenHandler();

            ClaimsIdentity identity = new ClaimsIdentity(
                new GenericIdentity(user.Email, "TokenAuth"),
                new[] { new Claim("Id", user.Id) }
            );

            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = TokenAuthOption.Issuer,
                Audience = TokenAuthOption.Audience,
                SigningCredentials = TokenAuthOption.SigningCredentials,
                Subject = identity,
                Expires = expires
            });
            return handler.WriteToken(securityToken);
        }
    }
}
