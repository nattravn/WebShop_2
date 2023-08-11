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
    public interface IShoeRepository
    {
        Shoe GetShoe(int shoeId);
        Task<GetTableListResponseDto<ShoeDto>> GetShoesWithParams(
            int limit,
            int page,
            string key,
            string order,
            string search,
            CancellationToken cancellationToken);
        IEnumerable<Shoe> GetShoes();
        IEnumerable<Shoe> GetShoesFromUserId(string shoeId);
        IEnumerable<Shoe> GetShoes(CommonResourceParameters commonResourceParameters);
        bool ShoeExists(int categoryId);
        bool ShoeExists(string shoe);
        void AddShoe(Shoe shoe);
        void UpdateShoe(Shoe shoe);
        void DeleteShoe(Shoe shoe);
        bool Save();
    }
}
