using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DAL
{
    public class GenericRepositery<T>: IGenericRepositery<T> where T : class
    {
        private readonly BlogContext dBContext;

        public GenericRepositery(BlogContext dbContext)
        {
            this.dBContext = dbContext;
        }

        public T Add(T entity)
        {
            try
            {
                dBContext.Set<T>().Add(entity);
                dBContext.SaveChanges();
                return entity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IQueryable<T> Get(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return dBContext.Set<T>().Where(predicate);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IQueryable<T> List(Expression<Func<T, bool>> predicate = null)
        {
            try
            {
                if (predicate != null)
                    return dBContext.Set<T>().Where(predicate);
                else
                    return dBContext.Set<T>();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IQueryable<T> PagedList(int pageSize, int pageNo, Expression<Func<T, bool>> predicate = null)
        {
            try
            {
                IQueryable<T> query = null;

                int skipRecords = pageNo <= 1 ? 0 : (pageNo - 1) * pageSize;

                query = dBContext.Set<T>();

                // search
                if (predicate != null)
                    query = query.Where(predicate);

                query = query.Skip(skipRecords).Take(pageSize);
                return query;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public T Update(T entity)
        {
            try
            {
                dBContext.Entry(entity).State = EntityState.Modified;
                dBContext.SaveChanges();

                return entity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool Delete(T entity)
        {
            try
            {
                dBContext.Set<T>().Remove(entity);
                dBContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int Count(Expression<Func<T, bool>> predicate = null)
        {
            try
            {
                IQueryable<T> query = null;

                query = dBContext.Set<T>();

                // search
                if (predicate != null)
                    query = query.Where(predicate);

                return query.Count();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
