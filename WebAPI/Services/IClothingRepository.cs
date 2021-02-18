using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.ResourceParameters;

namespace WebAPI.Services
{
    public interface IClothingRepository
    {
        Clothing GetClothing(int clothingId);
        IEnumerable<Clothing> GetClothings();
        IEnumerable<Clothing> GetClothingsFromUserId(string userId);
        IEnumerable<Clothing> GetClothings(CommonResourceParameters clothingsResourceParameters);
        bool ClothingExists(int categoryId);
        bool ClothingTitleExists(string clothingTitle);
        void AddClothing(Clothing clothing);
        void UpdateClothing(Clothing clothing);
        void DeleteClothing(Clothing clothing);
        bool Save();
    }
}
