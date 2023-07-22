using Microsoft.EntityFrameworkCore;
using PaginationDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace WebAPI.Extensions
{
	//https://stackoverflow.com/questions/64915382/c-sharp-linq-include-where-condition-only-if-it-is-not-null
	public static class WhereIfExtension
	{
		public static IQueryable<T> WhereIf<T>(
				this IQueryable<T> source,
				bool condition,
				Expression<Func<T, bool>> predicate)
		{
				return condition
						? source
						: source.Where(predicate);
		}
	}
}
