using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.ResourceParameters;
using WebAPI.Extensions;
using WebAPI.Constants;
using System.Globalization;
using WebAPI.Filter;

namespace WebAPI.Services
{
    public class ClothingRepository : IClothingRepository, IDisposable
    {
        private RecorddbContext _context;
        ICategoryRepository _categoryRepository;

        public ClothingRepository(RecorddbContext context, ICategoryRepository categoryRepository)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _categoryRepository = categoryRepository
                ?? throw new ArgumentNullException(nameof(categoryRepository));
            _categoryRepository = categoryRepository;
        }

        public Clothing GetClothing(int clothingId)
        {
            return _context.Clothings.FirstOrDefault(r => r.Id == clothingId);
        }

        public IEnumerable<Clothing> GetClothings()
        {
            return _context.Clothings.ToList<Clothing>();
        }

        public IEnumerable<Clothing> GetClothings(CommonResourceParameters clothingsResourceParameters)
        {
            if (clothingsResourceParameters == null)
            {
                throw new ArgumentNullException(nameof(clothingsResourceParameters));
            }

            if (string.IsNullOrWhiteSpace(clothingsResourceParameters.Name)
                 && string.IsNullOrWhiteSpace(clothingsResourceParameters.SearchQuery))
            {
                return GetClothings();
            }

            var collection = _context.Clothings as IQueryable<Clothing>;

            if (!string.IsNullOrWhiteSpace(clothingsResourceParameters.Name))
            {
                var clothingName = clothingsResourceParameters.Name.Trim();
                collection = collection.Where(a => a.Title == clothingName);
            }

            if (!string.IsNullOrWhiteSpace(clothingsResourceParameters.SearchQuery))
            {

                var searchQuery = clothingsResourceParameters.SearchQuery.Trim();
                collection = collection.Where(a => a.Title.Contains(searchQuery)
                    || a.Title.Contains(searchQuery));
            }

            return collection.ToList();
        }

        public bool ClothingExists(int clothingId)
        {
            return _context.Clothings.Any(r => r.Id == clothingId);
        }

        public bool ClothingTitleExists(string clothingBand)
        {
            return _context.Clothings.Any(r => r.Title == clothingBand);
        }

        public void AddClothing(Clothing clothingToAdd)
        {
            if (clothingToAdd == null)
            {
                throw new ArgumentException(null, nameof(clothingToAdd));
            }

            clothingToAdd.Id = _context.Clothings.OrderByDescending(r => r.Id).First().Id +1;
            //Clothing id
            clothingToAdd.CategoryId = _categoryRepository.GetCategoryByName(CategoryNames.Clothings).Id;
            clothingToAdd.CategoryName = CategoryNames.Clothings;

            _context.Clothings.Add(clothingToAdd);
        }

        public void DeleteClothing(Clothing clothing)
        {
            if (clothing == null)
            {
                throw new ArgumentNullException(nameof(clothing));
            }

            _context.Clothings.Remove(clothing);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void UpdateClothing(Clothing clothing)
        {
            // no code in this implementation
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

        public IEnumerable<Clothing> GetClothingsFromUserId(string userId)
        {
            return _context.Clothings.Where(c => c.CreatorUserId == userId).ToList();
        }

        public async Task<GetTableListResponseDto<ClothingDto>> GetClothingsWithParams(
            int limit,
            int page,
            string key,
            string order,
            string search,
            CancellationToken cancellationToken)
        {
            var searchQuery = "";

            if (!string.IsNullOrEmpty(search))
            {
                searchQuery = search.Trim().ToLower(CultureInfo.CurrentCulture);
            }

            var clothings = await _context.Clothings
                                    .AsNoTracking()
                                    .WhereIf(string.IsNullOrEmpty(searchQuery), a => a.Title.Contains(searchQuery)
                                        || a.CategoryName.Contains(searchQuery)
                                        || a.Id.ToString().Equals(searchQuery))
                                    .OrderByMember(key, order == "desc")
                                    .PaginateAsync(page, limit, cancellationToken).ConfigureAwait(false);

            return new GetTableListResponseDto<ClothingDto>
            {
                CurrentPage = clothings.CurrentPage,
                TotalPages = clothings.TotalPages,
                TotalItems = clothings.TotalItems,
                Items = clothings.Items.Select(p => new ClothingDto
                {
                    Id = p.Id,
                    CategoryId = p.CategoryId.GetValueOrDefault(),
                    Description = p.Description,
                    ImagePath = p.ImagePath,
                    Price = p.Price.GetValueOrDefault(),
                    Size = p.Size,
                    Image = p.Image,
                    CategoryName = p.CategoryName,
                    SubCategoryId = p.SubCategoryId.GetValueOrDefault(),
                    Title = p.Title,
                    CreatorUserId = p.CreatorUserId,
                    EditorUserId = p.EditorUserId,
                    LastUpdatedTime = p.LastUpdatedTime,
                    ReleaseDate = p.ReleaseDate
                }).ToList()
            };
        }
    }
}

