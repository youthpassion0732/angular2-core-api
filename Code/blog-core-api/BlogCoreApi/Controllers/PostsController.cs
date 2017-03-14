using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using DomainEntities;
using DAL;
using Microsoft.AspNetCore.Authorization;

namespace BlogCoreApi.Controllers
{
    [Route("api/[controller]")]
    //[Authorize("Bearer")]
    public class PostsController : Controller
    {
        private IGenericRepositery<Post> postRepo;

        public PostsController(IGenericRepositery<Post> postRepo)
        {
            this.postRepo = postRepo;
        }

        // GET api/posts
        [HttpGet]
        public IEnumerable<Post> Get()
        {
            return postRepo.List().ToList();
        }

        // GET api/posts/5
        [HttpGet("{id}")]
        public Post Get(int id)
        {
            return postRepo.Get(x => x.Id == id).FirstOrDefault();
        }

        // POST api/posts
        [HttpPost]
        public int Post([FromBody]Post post)
        {
           var result = postRepo.Add(post);
            if (result != null)
                return result.Id;
            else
                return -1;
        }

        // PUT api/posts/5
        [HttpPut("{id}")]
        public bool Put(int id, [FromBody]Post post)
        {
            Post postToUpdate = postRepo.Get(x => x.Id == post.Id).FirstOrDefault();
            if (postToUpdate != null)
            {
                postToUpdate.Title = post.Title;
                postToUpdate.Description = post.Description;

                postRepo.Update(postToUpdate);
                return true;
            }
            else
            {
                return false;
            }
        }

        // DELETE api/posts/5
        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            var post = postRepo.Get(x => x.Id == id).FirstOrDefault();
            if (post != null)
                return postRepo.Delete(post);
            else
                return false;
        }

    }
}
