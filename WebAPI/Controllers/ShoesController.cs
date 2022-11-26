using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebAPI.Models;
using WebAPI.ResourceParameters;
using WebAPI.Services;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoesController : ControllerBase
    {
        private readonly IShoeRepository _shoeRepository;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ShoesController(
            IMapper mapper,
            IShoeRepository shoeRepository,
            ImageService imageService)
        {
            _shoeRepository = shoeRepository
                ?? throw new ArgumentNullException(nameof(shoeRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _imageService = imageService;
        }

        // GET: api/Shoes
        [HttpGet()]
        [HttpHead]
        //[ShoesResultFilter]
        public ActionResult<IEnumerable<ShoeDto>> GetShoes(
            [FromQuery] CommonResourceParameters comonResourceParameters)
        {
            var shoesFromRepo = _shoeRepository.GetShoes(comonResourceParameters);
            return Ok(_mapper.Map<IEnumerable<ShoeDto>>(shoesFromRepo));
        }

        [HttpGet("GetPagedProducts", Name = "GetShoeListAsync")]
        [ProducesResponseType(typeof(GetTableListResponseDto<RecordDto>), Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), Status400BadRequest)]
        public async Task<IActionResult> GetShoeListAsync(
            [FromQuery] UrlQueryParameters urlQueryParameters,
            CancellationToken cancellationToken)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            // https://vmsdurano.com/asp-net-core-5-implement-web-api-pagination-with-hateoas-links/
            var records = await _shoeRepository.GetShoesWithParams(
                                    urlQueryParameters.Limit,
                                    urlQueryParameters.Page,
                                    cancellationToken);

            return Ok(records);
        }


        // GET: api/Shoes/5
        [HttpGet("{shoeId}", Name = "GetShoe")]
        public IActionResult GetShoe(int shoeId)
        {
            var shoeFromRepo = _shoeRepository.GetShoe(shoeId);

            if (shoeFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ShoeDto>(shoeFromRepo));
        }

        // GET: api/Shoes/username/userId
        [HttpGet("username/{userId}")]
        public ActionResult<IEnumerable<ShoeDto>> GetShoesByUserName(string userId)
        {
            var shoesFromRepo = _shoeRepository.GetShoesFromUserId(userId);
            return Ok(_mapper.Map<IEnumerable<ShoeDto>>(shoesFromRepo));
        }

        [HttpPost]
        public ActionResult<ShoeDto> CreateShoe([FromForm] ShoeForCreationDto shoeToCreate)
        {
            var resizedImage = _imageService.ResizeImage(Request.Form.Files[0]);

            _imageService.uploadImage(resizedImage, "resized");
            _imageService.uploadImage(Request.Form.Files[0], "original");

            shoeToCreate.ImagePath = Request.Form.Files[0].FileName;

            var shoeEntity = _mapper.Map<Entities.Shoe>(shoeToCreate);

            if (_shoeRepository.ShoeExists(shoeEntity.Title))
            {
                ModelState.AddModelError(
                    "Description",
                    "The provided band already exists.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _shoeRepository.AddShoe(shoeEntity);
            _shoeRepository.Save();

            var shoeToReturn = _mapper.Map<ShoeDto>(shoeEntity);
            return CreatedAtRoute("GetShoe",
                new { shoeId = shoeToReturn.Id },
                shoeToReturn);
        }

        [HttpPut("{shoeId}")]
        public IActionResult UpdateShoe(int shoeId,
            [FromForm] ShoeForCreationDto shoeToUpdate)
        {
            var resizedImage = _imageService.ResizeImage(Request.Form.Files[0]);

            _imageService.uploadImage(resizedImage, "resized");
            _imageService.uploadImage(Request.Form.Files[0], "original");

            shoeToUpdate.ImagePath = Request.Form.Files[0].FileName;

            if (!_shoeRepository.ShoeExists(shoeId))
            {
                return NotFound();
            }

            var shoeFromRepo = _shoeRepository.GetShoe(shoeId);

            if (shoeFromRepo == null)
            {
                var shoeToAdd = _mapper.Map<Entities.Shoe>(shoeToUpdate);
                shoeToAdd.Id = shoeId;

                _shoeRepository.AddShoe(shoeToAdd);

                _shoeRepository.Save();

                var shoeToReturn = _mapper.Map<ShoeDto>(shoeToAdd);

                return CreatedAtRoute("GetShoe",
                    new { shoeId = shoeToReturn.Id },
                    shoeToReturn);
            }

            // map the entity to a ShoeForUpdateDto
            // apply the updated field values to that dto
            // map the ShoeForUpdateDto back to an entity
            _mapper.Map(shoeToUpdate, shoeFromRepo);

            _shoeRepository.UpdateShoe(shoeFromRepo);

            _shoeRepository.Save();
            return NoContent();
        }

        // DELETE: api/Shoe/5
        [HttpDelete("{shoeId}")]
        public ActionResult DeleteAuthor(int shoeId)
        {
            var shoeFromRepo = _shoeRepository.GetShoe(shoeId);

            if (shoeFromRepo == null)
            {
                return NotFound();
            }

            _imageService.deleteFolder(shoeFromRepo.ImagePath);
            _shoeRepository.DeleteShoe(shoeFromRepo);

            _shoeRepository.Save();

            return NoContent();
        }


    }
}
