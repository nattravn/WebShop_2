using System.Linq.Expressions;
using System.Linq;
using System;

namespace UserApi.Filter
{
    public static partial class QueryableExtensions
    {
        // https://stackoverflow.com/questions/41068799/dynamic-linq-to-entities-orderby-with-pagination
        public static IOrderedQueryable<T> OrderByMember<T>(this IQueryable<T> source, string memberPath, bool descending)
        {
            var parameter = Expression.Parameter(typeof(T), "item");
            var member = memberPath.Split('.')
                .Aggregate((Expression)parameter, Expression.PropertyOrField);

            var keySelector = Expression.Lambda(member, parameter);

            if (member.Type == typeof(string))
            {
                var toLowerMethodInfo = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                var toLowerExpression = Expression.Call(member, toLowerMethodInfo);
                keySelector = Expression.Lambda(toLowerExpression, parameter);
            }


            var methodCall = Expression.Call(
                typeof(Queryable), descending ? "OrderByDescending" : "OrderBy",
                new[] { parameter.Type, member.Type }, // We're using member.Type as the key type
                source.Expression,
                Expression.Quote(keySelector));

            return (IOrderedQueryable<T>)source.Provider.CreateQuery(methodCall);
        }
    }
}
