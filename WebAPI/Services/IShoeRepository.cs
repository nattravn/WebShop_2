using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.ResourceParameters;

namespace WebAPI.Services
{
    public interface IShoeRepository
    {
        Shoe GetShoe(int shoeId);
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
