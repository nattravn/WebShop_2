using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using WebAPI.Entities;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{

    [ApiController]
    [Route("api/category/{categoryId}/subCategories")]
    public class SubCategoriesController : ControllerBase
    {
        private readonly RecorddbContext _context;
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public SubCategoriesController(
            RecorddbContext context,
            IMapper mapper,
            ICategoryRepository categoryRepository,
            ISubCategoryRepository subCategoryRepository)
        {
            _context = context;
            _subCategoryRepository = subCategoryRepository
                ?? throw new ArgumentNullException(nameof(subCategoryRepository));
            _categoryRepository = categoryRepository
                ?? throw new ArgumentNullException(nameof(categoryRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        // GET: api/category/5/subCategories
        [HttpGet]
        public ActionResult<IEnumerable<SubCategoryDto>> GetSubCategoriesForCategory(int categoryID)
        {
            if (!_categoryRepository.CategoryExists(categoryID))
            {
                return NotFound();
            }

            var subCategoriesForCategory = _subCategoryRepository.GetSubCategoriesFromCategory(categoryID);
            return Ok(_mapper.Map<IEnumerable<SubCategoryDto>>(subCategoriesForCategory));
        }

        // GET: api/categories/5/subCategory/5
        [HttpGet("{subCategoryId}", Name = "GetSubCategoryForCategory")]
        public ActionResult<SubCategoryDto> GetSubCategoryForCategory(int categoryId, int subCategoryId)
        {
            if (!_categoryRepository.CategoryExists(categoryId))
            {
                return NotFound();
            }

            var subCategoryFromRepo = _subCategoryRepository.GetSubCategory(categoryId, subCategoryId);

            if (subCategoryFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<SubCategoryDto>(subCategoryFromRepo));
        }


        // PUT: api/SubCategories/5
        [HttpPut("{subCategoryId}")]
        public IActionResult PutSubCategories(int subCategoryId, int categoryId, SubCategoryForCreationDto subCategory)
        {
            var subCategoryFromRepo = _subCategoryRepository.GetSubCategory(categoryId, subCategoryId);

            if (subCategoryFromRepo == null)
            {
                var subCategoryToAdd = _mapper.Map<Entities.SubCategory>(subCategory);
                subCategoryToAdd.Id = subCategoryId;

                _subCategoryRepository.AddSubCategory(subCategoryId, subCategoryToAdd);

                _subCategoryRepository.Save();

                var subCategoryToReturn = _mapper.Map<SubCategoryDto>(subCategoryToAdd);

                return CreatedAtRoute("GetSubCategories",
                    new { subCategoryId = subCategoryId },
                    subCategoryToReturn);
            }

            // map the entity to a CourseForUpdateDto
            // apply the updated field values to that dto
            // map the CourseForUpdateDto back to an entity
            _mapper.Map(subCategory, subCategoryFromRepo);

            _subCategoryRepository.UpdateSubCategory(subCategoryFromRepo);

            _subCategoryRepository.Save();
            return NoContent();
        }

        // POST:
        [HttpPost]
        public ActionResult<SubCategory> CreateSubcategoryForCategory(
            int categoryId, SubCategoryForCreationDto subCategory)
        {
            if (!_subCategoryRepository.CategoryExists(categoryId))
            {
                return NotFound();
            }

            var subCategoryEntity = _mapper.Map<Entities.SubCategory>(subCategory);

            if (_subCategoryRepository.SubCategoryNameExists(subCategory.Name))
            {
                ModelState.AddModelError(
                    "Description",
                    "The provided name already exists.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _subCategoryRepository.AddSubCategory(categoryId, subCategoryEntity);
            _subCategoryRepository.Save();

            var subCategoryToReturn = _mapper.Map<SubCategoryDto>(subCategoryEntity);
            return CreatedAtRoute("GetSubCategoryForCategory",
                new { categoryId = categoryId, subCategoryId = subCategoryToReturn.Id },
                subCategoryToReturn);
        }

        [HttpDelete("{subCategoryId}")]
        public ActionResult DeleteSubCategory(int categoryId, int subCategoryId)
        {
            if (!_subCategoryRepository.CategoryExists(categoryId))
            {
                return NotFound();
            }

            var subCategoryForCategoryFromRepo = _subCategoryRepository.GetSubCategory(categoryId, subCategoryId);

            if (subCategoryForCategoryFromRepo == null)
            {
                return NotFound();
            }

            _subCategoryRepository.DeleteSubCategory(subCategoryForCategoryFromRepo);
            _subCategoryRepository.Save();

            return NoContent();
        }
    }
}
