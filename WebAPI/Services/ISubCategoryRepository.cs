using System.Collections.Generic;
using WebAPI.Entities;

namespace WebAPI.Services
{
    public interface ISubCategoryRepository
    {
        SubCategory GetSubCategory(int categoryId, int subCategoryId);
        bool CategoryExists(int categoryId);
        bool SubCategoryNameExists(string subCategory);
        void AddSubCategory(int categoryId, SubCategory subCategory);
        IEnumerable<SubCategory> GetSubCategoriesFromCategory(int categoryId);
        void DeleteSubCategory(SubCategory subCategory);
        void UpdateSubCategory(SubCategory subCategory);
        bool Save();
    }
}
