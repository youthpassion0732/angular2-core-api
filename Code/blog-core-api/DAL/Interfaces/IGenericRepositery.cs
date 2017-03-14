using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DAL
{
    public interface IGenericRepositery<T> where T: class
    {
        T Add(T entity);

        IQueryable<T> Get(Expression<Func<T, bool>> predicate);

        IQueryable<T> List(Expression<Func<T, bool>> predicate = null);

        IQueryable<T> PagedList(int pageSize, int pageNo, Expression<Func<T, bool>> predicate = null);

        T Update(T entity);

        bool Delete(T entity);

        int Count(Expression<Func<T, bool>> predicate = null);
    }
}
