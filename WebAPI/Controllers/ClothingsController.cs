using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.ResourceParameters;
using WebAPI.Services;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClothingsController : ControllerBase
    {
        private readonly IClothingRepository _clothingRepository;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ClothingsController(
            IMapper mapper,
            IClothingRepository clothingRepository,
            ImageService imageService)
        {
            _clothingRepository = clothingRepository
                ?? throw new ArgumentNullException(nameof(clothingRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _imageService = imageService;
        }

        // GET: api/Clothings
        [HttpGet()]
        [HttpHead]
        //[ClothingsResultFilter]
        public ActionResult<IEnumerable<ClothingDto>> GetClothings(
            [FromQuery] CommonResourceParameters commonResourceParameters)
        {
            var clothingsFromRepo = _clothingRepository.GetClothings(commonResourceParameters);
            return Ok(_mapper.Map<IEnumerable<ClothingDto>>(clothingsFromRepo));
        }

        // api/clothings/GetPagedProducts/
        [HttpGet("GetPagedProducts", Name = "GetClothingListAsync")]
        [ProducesResponseType(typeof(GetTableListResponseDto<ClothingDto>), Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), Status400BadRequest)]
        public async Task<IActionResult> GetClothingListAsync(
            [FromQuery] UrlQueryParameters urlQueryParameters,
            CancellationToken cancellationToken)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var records = await _clothingRepository.GetClothingsWithParams(
                                    urlQueryParameters.Limit,
                                    urlQueryParameters.Page,
                                    urlQueryParameters.Key,
                                    urlQueryParameters.Order,
                                    urlQueryParameters.SearchQuery,
                                    cancellationToken).ConfigureAwait(true);

            return Ok(records);
        }


        // GET: api/Clothings/5
        [HttpGet("{clothingId}", Name = "GetClothing")]
        public IActionResult GetClothing(int clothingId)
        {
            var clothingFromRepo = _clothingRepository.GetClothing(clothingId);

            if (clothingFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ClothingDto>(clothingFromRepo));
        }

        // GET: api/Clothings/username/userId
        [HttpGet("username/{userId}")]
        public ActionResult<IEnumerable<ClothingDto>> GetClothingsByUserName(string userId)
        {
            var clothingsFromRepo = _clothingRepository.GetClothingsFromUserId(userId);
            return Ok(_mapper.Map<IEnumerable<ClothingDto>>(clothingsFromRepo));
        }

        [HttpPost]
        public ActionResult<ClothingDto> CreateClothing([FromForm] ClothingForCreationDto clothingToCreate)
        {
            var resizedImage = _imageService.ResizeImage(Request.Form.Files[0]);

            _imageService.uploadImage(resizedImage, "resized");
            _imageService.uploadImage(Request.Form.Files[0], "original");

            clothingToCreate.ImagePath = Request.Form.Files[0].FileName;

            var clothingEntity = _mapper.Map<Entities.Clothing>(clothingToCreate);

            if (_clothingRepository.ClothingTitleExists(clothingEntity.Title))
            {
                ModelState.AddModelError(
                    "Description",
                    "The provided band already exists.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _clothingRepository.AddClothing(clothingEntity);
            _clothingRepository.Save();

            var clothingToReturn = _mapper.Map<ClothingDto>(clothingEntity);
            return CreatedAtRoute("GetClothing",
                new { clothingId = clothingToReturn.Id },
                clothingToReturn);
        }

        [HttpPut("{clothingId}")]
        public IActionResult UpdateClothing([FromForm] ClothingDto clothingToUpdate, int clothingId)
        {
            if (Request.Form.Files.Count != 0)
            {
                var resizedImage = _imageService.ResizeImage(Request.Form.Files[0]);

                _imageService.uploadImage(resizedImage, "resized");
                _imageService.uploadImage(Request.Form.Files[0], "original");

                clothingToUpdate.ImagePath = Request.Form.Files[0].FileName;
            }
            

            if (!_clothingRepository.ClothingExists(clothingId))
            {
                return NotFound();
            }

            var clothingFromRepo = _clothingRepository.GetClothing(clothingId);

            if (clothingFromRepo == null)
            {
                var clothingToAdd = _mapper.Map<Entities.Clothing>(clothingToUpdate);
                clothingToAdd.Id = clothingId;

                _clothingRepository.AddClothing(clothingToAdd);
                _clothingRepository.Save();

                var clothingToReturn = _mapper.Map<ClothingDto>(clothingToAdd);

                return CreatedAtRoute("GetClothing",
                    new { clothingId = clothingToReturn.Id },
                    clothingToReturn);
            }

            clothingToUpdate.LastUpdatedTime = DateTime.Now;
            clothingToUpdate.CategoryName = "clothings";
            // map the entity to a ClothingForUpdateDto
            // apply the updated field values to that dto
            // map the ClothingForUpdateDto back to an entity
            _mapper.Map(clothingToUpdate, clothingFromRepo);

            _clothingRepository.UpdateClothing(clothingFromRepo);

            _clothingRepository.Save();
            return CreatedAtRoute("GetClothing",
                new { clothingId = clothingFromRepo.Id },
                clothingFromRepo);
        }

        // DELETE: api/Clothing/5
        [HttpDelete("{clothingId}")]
        public ActionResult DeleteAuthor(int clothingId)
        {
            var clothingFromRepo = _clothingRepository.GetClothing(clothingId);

            if (clothingFromRepo == null)
            {
                return NotFound();
            }

            _imageService.deleteFolder(clothingFromRepo.ImagePath);
            _clothingRepository.DeleteClothing(clothingFromRepo);

            _clothingRepository.Save();

            return NoContent();
        }
    }
}
