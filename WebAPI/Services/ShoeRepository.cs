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

        public Shoe GetShoe(int flagId)
        {
            return _context.Shoes.FirstOrDefault(r => r.Id == flagId);
        }

        public IEnumerable<Shoe> GetShoes()
        {
            return _context.Shoes.ToList<Shoe>();
        }

        public IEnumerable<Shoe> GetShoes(CommonResourceParameters flagsResourceParameters)
        {
            if (flagsResourceParameters == null)
            {
                throw new ArgumentNullException(nameof(flagsResourceParameters));
            }

            if (string.IsNullOrWhiteSpace(flagsResourceParameters.Name)
                 && string.IsNullOrWhiteSpace(flagsResourceParameters.SearchQuery))
            {
                return GetShoes();
            }

            var collection = _context.Shoes as IQueryable<Shoe>;

            if (!string.IsNullOrWhiteSpace(flagsResourceParameters.Name))
            {
                var flagName = flagsResourceParameters.Name.Trim();
                collection = collection.Where(f => f.Title == flagName);
            }

            if (!string.IsNullOrWhiteSpace(flagsResourceParameters.SearchQuery))
            {

                var searchQuery = flagsResourceParameters.SearchQuery.Trim();
                collection = collection.Where(f => f.Title.Contains(searchQuery)
                    || f.Title.Contains(searchQuery));
            }

            return collection.ToList();
        }

        public bool ShoeExists(int flagId)
        {
            return _context.Shoes.Any(r => r.Id == flagId);
        }

        public bool ShoeExists(string flagTitle)
        {
            return _context.Shoes.Any(r => r.Title == flagTitle);
        }

        public async void AddShoe(Shoe flagToAdd)
        {
            if (flagToAdd == null)
            {
                throw new ArgumentException(nameof(flagToAdd));
            }   

            //flagToAdd.Id = _context.Flag.OrderByDescending(r => r.Id).First().Id +1;
            flagToAdd.CategoryId = 4;
            flagToAdd.CategoryName = "Flag";
            flagToAdd.UserId = "test";

            _context.Shoes.Add(flagToAdd);
        }

        public void DeleteShoe(Shoe flag)
        {
            if (flag == null)
            {
                throw new ArgumentNullException(nameof(flag));
            }

            _context.Shoes.Remove(flag);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void UpdateShoe(Shoe flag)
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

