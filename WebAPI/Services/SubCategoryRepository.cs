using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Entities;

namespace WebAPI.Services
{
    public class SubCategoryRepository : ISubCategoryRepository, IDisposable
    {
        private RecorddbContext _context;

        public SubCategoryRepository(RecorddbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public bool CategoryExists(int categoryId)
        {
            return _context.Categories.Any(c => c.Id == categoryId);
        }

        public bool SubCategoryNameExists(string subCategoryName)
        {
            return _context.Categories.Any(sc => sc.Name == subCategoryName);
        }

        public SubCategory GetSubCategory(int categoryId, int subCategoryId)
        {
            return _context.SubCategories
              .Where(c => c.CategoryId == categoryId && c.Id == subCategoryId).FirstOrDefault();
        }

        public void AddSubCategory(int categoryId, SubCategory subCategory)
        {
            if (subCategory == null)
            {
                throw new ArgumentNullException(nameof(subCategory));
            }

            // always set the CategoryId to the passed-in categoryId
            subCategory.CategoryId = categoryId;
            subCategory.Id = _context.SubCategories.Count();
            subCategory.Id += 1;

            _context.SubCategories.Add(subCategory);
        }

        public IEnumerable<SubCategory> GetSubCategoriesFromCategory(int categoryId)
        {
            return _context.SubCategories
                        .Where(c => c.CategoryId == categoryId)
                        .OrderBy(c => c.Name).ToList();
        }

        public void DeleteSubCategory(SubCategory subCategory)
        {
            _context.Remove(subCategory);
        }

        public void UpdateSubCategory(SubCategory subCategory)
        {
            // no code in this implementation
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_context != null)
                {
                    _context.Dispose();
                    _context = null;
                }
            }
        }
    }
}

