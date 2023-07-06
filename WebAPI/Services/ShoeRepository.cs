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

namespace WebAPI.Services
{
    public class ShoeRepository : IShoeRepository, IDisposable
    {
        private RecorddbContext _context;
        private readonly UserService _userService;

        public ShoeRepository(RecorddbContext context, UserService userService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _userService = userService;
        }

        public Shoe GetShoe(int shoeId)
        {
            return _context.Shoes.FirstOrDefault(r => r.Id == shoeId);
        }

        public IEnumerable<Shoe> GetShoes()
        {
            return _context.Shoes.ToList<Shoe>();
        }

        public IEnumerable<Shoe> GetShoes(CommonResourceParameters shoesResourceParameters)
        {
            if (shoesResourceParameters == null)
            {
                throw new ArgumentNullException(nameof(shoesResourceParameters));
            }

            if (string.IsNullOrWhiteSpace(shoesResourceParameters.Name)
                 && string.IsNullOrWhiteSpace(shoesResourceParameters.SearchQuery))
            {
                return GetShoes();
            }

            var collection = _context.Shoes as IQueryable<Shoe>;

            if (!string.IsNullOrWhiteSpace(shoesResourceParameters.Name))
            {
                var shoeName = shoesResourceParameters.Name.Trim();
                collection = collection.Where(f => f.Title == shoeName);
            }

            if (!string.IsNullOrWhiteSpace(shoesResourceParameters.SearchQuery))
            {

                var searchQuery = shoesResourceParameters.SearchQuery.Trim();
                collection = collection.Where(f => f.Title.Contains(searchQuery)
                    || f.Title.Contains(searchQuery));
            }

            return collection.ToList();
        }

        public bool ShoeExists(int shoeId)
        {
            return _context.Shoes.Any(r => r.Id == shoeId);
        }

        public bool ShoeExists(string shoeTitle)
        {
            return _context.Shoes.Any(r => r.Title == shoeTitle);
        }

        public void AddShoe(Shoe shoeToAdd)
        {
            if (shoeToAdd == null)
            {
                throw new ArgumentException("Shoe is null");
            }   

            //shoeToAdd.Id = _context.shoe.OrderByDescending(r => r.Id).First().Id +1;
            shoeToAdd.CategoryId = 4;
            shoeToAdd.CategoryName = "shoe";
            shoeToAdd.UserId = "test";

            _context.Shoes.Add(shoeToAdd);
        }

        public void DeleteShoe(Shoe shoe)
        {
            if (shoe == null)
            {
                throw new ArgumentNullException(nameof(shoe));
            }

            _context.Shoes.Remove(shoe);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void UpdateShoe(Shoe shoe)
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

        public IEnumerable<Shoe> GetShoesFromUserId(string userId)
        {
            return _context.Shoes.Where(f => f.UserId == userId).ToList();
        }

        public async Task<GetTableListResponseDto<ShoeDto>> GetShoesWithParams(int limit, int page, CancellationToken cancellationToken)
        {
            var shoes = await _context.Shoes
                           .AsNoTracking()
                           .OrderBy(p => p.Id)
                           .PaginateAsync(page, limit, cancellationToken);

            return new GetTableListResponseDto<ShoeDto>
            {
                CurrentPage = shoes.CurrentPage,
                TotalPages = shoes.TotalPages,
                TotalItems = shoes.TotalItems,
                Items = shoes.Items.Select(p => new ShoeDto
                {
                    Id = p.Id,
                    CategoryId = p.CategoryId.GetValueOrDefault(),
                    Title = p.Title,
                    SubCategoryId = p.SubCategoryId.GetValueOrDefault(),
                    Price = p.Price.GetValueOrDefault(),
                    ImagePath = p.ImagePath,
                    Description = p.Description,
                    CategoryName = p.CategoryName,
                    Image = p.Image,
                    UserId = p.UserId
                    
                }).ToList()
            };
        }
    }
}

