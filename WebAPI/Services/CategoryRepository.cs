using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.ResourceParameters;
using WebAPI.Extensions;
using AutoMapper;

namespace WebAPI.Services
{
    public class CategoryRepository : ICategoryRepository, IDisposable
    {
        private RecorddbContext _context;
        private readonly IMapper _mapper;

        public CategoryRepository(
            RecorddbContext context,
            IMapper mapper
        )
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public bool CategoryExists(int categoryId)
        {
            return _context.Categories.Any(c => c.Id == categoryId);
        }

        public Category GetCategory(int catgoryId)
        {
            return _context.Categories.Include(b => b.SubCategories).FirstOrDefault(c => c.Id == catgoryId);
        }

        public IEnumerable<Entities.Category> GetCategories()
        {
            return _context.Categories.Include(b => b.SubCategories).ToList<Category>();
        }

        public bool CategoryNameExists(string categoryName)
        {
            return _context.Categories.Any(sc => sc.Name == categoryName);
        }

        public IEnumerable<Category> GetCategories(CategoriesResourceParameters categoriesResourceParameters)
        {
            if (categoriesResourceParameters == null)
            {
                throw new ArgumentNullException(nameof(categoriesResourceParameters));
            }

            if (string.IsNullOrWhiteSpace(categoriesResourceParameters.Name)
                 && string.IsNullOrWhiteSpace(categoriesResourceParameters.SearchQuery))
            {
                return GetCategories();
            }

            var collection = _context.Categories as IQueryable<Category>;

            if (!string.IsNullOrWhiteSpace(categoriesResourceParameters.Name))
            {
                var categoryName = categoriesResourceParameters.Name.Trim();
                collection = collection.Include(b => b.SubCategories).Where(a => a.Name == categoryName);
            }

            if (!string.IsNullOrWhiteSpace(categoriesResourceParameters.SearchQuery))
            {

                var searchQuery = categoriesResourceParameters.SearchQuery.Trim();
                collection = collection.Where(a => a.Name.Contains(searchQuery)
                    || a.Route.Contains(searchQuery));
            }

            return collection.ToList();
        }

        public void addCategory(Category categoryToAdd)
        {
            if(categoryToAdd == null)
            {
                throw new ArgumentException(null, nameof(categoryToAdd));
            }

            int newId = _context.SubCategories.Count();
            foreach (var subCategories in categoryToAdd.SubCategories)
            {
                newId++;
                subCategories.Id = newId;
            }

            categoryToAdd.Id = _context.Categories.Count() + 1;


            _context.Categories.Add(categoryToAdd);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void DeleteCategory(Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            _context.Categories.Remove(category);
        }

        public void UpdateCategory(CategoryForCreationDto category)
        {
            // No implemented code here
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

        public async Task<GetTableListResponseDto<CategoryDto>> GetCategoriesWithParams(int limit, int page, CancellationToken cancellationToken)
        {
            var category = await _context.Categories
                           .AsNoTracking()
                           .Include(b => b.SubCategories)
                           .OrderBy(p => p.Id)
                           .PaginateAsync(page, limit, cancellationToken);

            return new GetTableListResponseDto<CategoryDto>
            {
                CurrentPage = category.CurrentPage,
                TotalPages = category.TotalPages,
                TotalItems = category.TotalItems,
                Items = category.Items.Select(p => new CategoryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Route = p.Route,
                    SubCategories = _mapper.Map<ICollection<SubCategoryDto>>(p.SubCategories) 
                }).ToList()
            };
        }
    }
}

