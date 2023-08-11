using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.ResourceParameters;

namespace WebAPI.Services
{
    public interface ICategoryRepository
    {
        bool CategoryExists(int categoryId);
        Task<GetTableListResponseDto<CategoryDto>> GetCategoriesWithParams(int limit, int page, CancellationToken cancellationToken);
        bool CategoryNameExists(string categoryName);
        IEnumerable<Category> GetCategories();
        IEnumerable<Category> GetCategories(CategoriesResourceParameters categoriesResourceParameters);
        void addCategory(Category category);
        Category GetCategory(int id);
        Category GetCategoryByName(string categoryName);
        void DeleteCategory(Category category);
        void UpdateCategory(CategoryForCreationDto category);
        bool Save();
    }
}