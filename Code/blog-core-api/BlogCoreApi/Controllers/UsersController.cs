using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DomainEntities;
using DAL;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace BlogCoreApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize("Bearer")]
    public class UsersController : Controller
    {
        private IGenericRepositery<User> userRepo;
        private IAuthRepository authRepo;

        public UsersController(IGenericRepositery<User> userRepo,
                               IAuthRepository authRepo)
        {
            this.userRepo = userRepo;
            this.authRepo = authRepo;
        }

        // GET: api/users
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return userRepo.List().ToList();
        }

        // GET api/users/5
        [HttpGet("{id}")]
        public User Get(string id)
        {
            return userRepo.Get(x => x.Id == id).FirstOrDefault();
        }

        // POST api/users
        [HttpPost]
        [AllowAnonymous]
        public async Task<bool> Post([FromBody]User user)
        {
            var result = await authRepo.CreateAsync(user);
            if (result.Succeeded)
                return true;
            else
                return false;
        }

        // PUT api/users/5
        [HttpPut("{id}")]
        public bool Put(int id, [FromBody]User user)
        {
            User userToUpdate = userRepo.Get(x => x.Id == user.Id).FirstOrDefault();
            if (userToUpdate != null)
            {
                userToUpdate.FirstName = user.FirstName;
                userToUpdate.LastName = user.LastName;

                userRepo.Update(userToUpdate);
                return true;
            }
            else
            {
                return false;
            }
        }

        // DELETE api/users/5
        [HttpDelete("{id}")]
        public bool Delete(string id)
        {
            var user = userRepo.Get(x => x.Id == id).FirstOrDefault();
            if (user != null)
                return userRepo.Delete(user);
            else
                return false;
        }
    }
}
