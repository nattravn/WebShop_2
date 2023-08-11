using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Entities;
using WebAPI.Filter;
using WebAPI.Models;
using WebAPI.ResourceParameters;
//using WebAPI.Models;
using WebAPI.Services;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(
            IMapper mapper,
            ISubCategoryRepository subCategoryRepository,
            ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository
                ?? throw new ArgumentNullException(nameof(categoryRepository));
            _subCategoryRepository = subCategoryRepository
                ?? throw new ArgumentNullException(nameof(subCategoryRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        // GET: api/Category
        [HttpGet()]
        [HttpHead]
        public ActionResult<IEnumerable<CategoryDto>> GetCategories(
            [FromQuery] CategoriesResourceParameters categoriesResourceParameters)
        {
            var categoriesFromRepo = _categoryRepository.GetCategories(categoriesResourceParameters);
            return Ok(_mapper.Map<IEnumerable<CategoryDto>>(categoriesFromRepo));
        }


        // GET: api/Category/5
        [HttpGet("{categoryId}", Name = "GetCategory")]
        public IActionResult GetCategory(int categoryId)
        {
            var categoryFromRepo = _categoryRepository.GetCategory(categoryId);

            if (categoryFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<CategoryDto>(categoryFromRepo));
        }

        // GET: api/Category/categoryName
        [HttpGet("categoryName/{categoryName}", Name = "GetCategoryByName")]
        public IActionResult GetCategoryByName(string categoryName)
        {
            var categoryFromRepo = _categoryRepository.GetCategoryByName(categoryName);

            if (categoryFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<CategoryDto>(categoryFromRepo));
        }

        [HttpPost]
        public ActionResult<CategoryDto> CreateCategory(CategoryForCreationDto categoryToCreate)
        {
            var categoryEntity = _mapper.Map<Entities.Category>(categoryToCreate);

            if (_categoryRepository.CategoryNameExists(categoryEntity.Name))
            {
                ModelState.AddModelError(
                    "Description",
                    "The provided name already exists.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _categoryRepository.addCategory(categoryEntity);
            _categoryRepository.Save();

            var categoryToReturn = _mapper.Map<CategoryDto>(categoryEntity);
            return CreatedAtRoute("GetCategory",
                new { categoryId = categoryToReturn.Id },
                categoryToReturn);
        }

        [HttpOptions]
        public IActionResult GetCategoryOptions()
        {
            Response.Headers.Add("Allow", "GET,OPTIONS,POST");
            return Ok();
        }

        [HttpPut("{categoryId}")]
        public IActionResult UpdateCategory(int categoryId,
            CategoryForUpdateDto categoryToUpdateDto)
        {
            if (!_categoryRepository.CategoryExists(categoryId))
            {
                return NotFound();
            }

            var categoryFromRepo = _categoryRepository.GetCategory(categoryId);

            if (categoryFromRepo == null)
            {
                var categoryToAdd = _mapper.Map<Entities.Category>(categoryToUpdateDto);
                categoryToAdd.Id = categoryId;

                _categoryRepository.addCategory(categoryToAdd);

                _categoryRepository.Save();

                var categoryToReturn = _mapper.Map<CategoryDto>(categoryToAdd);

                return CreatedAtRoute("GetCategory",
                    new { categoryId = categoryToReturn.Id },
                    categoryToReturn);
            }


            foreach (var subCategoryToUpdate in categoryToUpdateDto.SubCategories)
            {
                var subCategoryFromRepo = _subCategoryRepository.GetSubCategory(categoryId, subCategoryToUpdate.Id);

                if(subCategoryFromRepo == null)
                {
                    var subCategoryEntity = _mapper.Map<Entities.SubCategory>(subCategoryToUpdate);
                    _subCategoryRepository.AddSubCategory(categoryId, subCategoryEntity);
                    _subCategoryRepository.Save();
                }
            }

            // map the entity to a categoryToUpdateDto
            // apply the updated field values to that dto
            // map the categoryToUpdateDto back to an entity
            _mapper.Map(categoryToUpdateDto, categoryFromRepo);

            foreach (var subCategoryDTO in categoryToUpdateDto.SubCategories)
            {
                _mapper.Map(subCategoryDTO, categoryFromRepo.SubCategories.FirstOrDefault(c => c.Id == subCategoryDTO.Id));
            }

            _categoryRepository.Save();
            return NoContent();
        }

        [HttpDelete("{categoryId}")]
        public ActionResult DeleteAuthor(int categoryId)
        {
            var categoryFromRepo = _categoryRepository.GetCategory(categoryId);

            if (categoryFromRepo == null)
            {
                return NotFound();
            }

            _categoryRepository.DeleteCategory(categoryFromRepo);

            _categoryRepository.Save();

            return NoContent();
        }

        [HttpGet("GetPagedCategories", Name = "GetCategoryListAsync")]
        [ProducesResponseType(typeof(GetTableListResponseDto<RecordDto>), Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), Status400BadRequest)]
        public async Task<IActionResult> GetCategoryListAsync(
            [FromQuery] UrlQueryParameters urlQueryParameters,
            CancellationToken cancellationToken)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            // https://vmsdurano.com/asp-net-core-5-implement-web-api-pagination-with-hateoas-links/
            var categories = await _categoryRepository.GetCategoriesWithParams(
                                    urlQueryParameters.Limit,
                                    urlQueryParameters.Page,
                                    cancellationToken).ConfigureAwait(true);

            return Ok(categories);
        }
    }
}
