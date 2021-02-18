using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.ResourceParameters;

namespace WebAPI.Services
{
    public interface ICategoryRepository
    {
        bool CategoryExists(int categoryId);
        bool CategoryNameExists(string categoryName);
        IEnumerable<Category> GetCategories();
        IEnumerable<Category> GetCategories(CategoriesResourceParameters categoriesResourceParameters);
        void addCategory(Category category);
        Category GetCategory(int id);
        void DeleteCategory(Category category);
        void UpdateCategory(CategoryForCreationDto category);
        bool Save();
    }
}