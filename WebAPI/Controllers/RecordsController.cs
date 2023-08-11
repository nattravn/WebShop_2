using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Services;
using WebAPI.Models;
using AutoMapper;
using WebAPI.ResourceParameters;
using Microsoft.AspNetCore.Razor.Language;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using static Microsoft.AspNetCore.Http.StatusCodes;
using Microsoft.Extensions.Hosting;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly IRecordRepository _recordRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        private readonly IHostEnvironment _hostEnvironment;

        public RecordsController(
            IMapper mapper,
            IRecordRepository recordRepository,
            ICategoryRepository categoryRepository,
            ImageService imageService,
            IHostEnvironment hostingEnvironment)
        {
            _recordRepository = recordRepository
                ?? throw new ArgumentNullException(nameof(recordRepository));
            _categoryRepository = categoryRepository
                ?? throw new ArgumentNullException(nameof(categoryRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _imageService = imageService;
            _hostEnvironment = hostingEnvironment;
        }
        
        // GET: api/Records
        [HttpGet()]
        [HttpHead]
        //[RecordsResultFilter]
        public ActionResult<IEnumerable<RecordDto>> GetRecords(
            [FromQuery] RecordResourceParameters recordsResourceParameters)
        {
            var recordsFromRepo = _recordRepository.GetRecords(recordsResourceParameters);
            return Ok(_mapper.Map<IEnumerable<RecordDto>>(recordsFromRepo));
        }

        [HttpGet("GetPagedProducts", Name = "GetRecordListAsync")]
        [ProducesResponseType(typeof(GetTableListResponseDto<RecordDto>), Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), Status400BadRequest)]
        public async Task<IActionResult> GetRecordListAsync(
            [FromQuery] UrlQueryParameters urlQueryParameters,
            CancellationToken cancellationToken)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            // https://vmsdurano.com/asp-net-core-5-implement-web-api-pagination-with-hateoas-links/
            var records = await _recordRepository.GetRecordWithParams(
                                    urlQueryParameters.Limit,
                                    urlQueryParameters.Page,
                                    urlQueryParameters.Key,
                                    urlQueryParameters.Order,
                                    urlQueryParameters.SearchQuery,
                                    cancellationToken);

            return Ok(records);
        }

        // GET: api/Records/5
        [HttpGet("{recordId}", Name = "GetRecord")]
        public IActionResult GetRecord(int recordId)
        {
            var recordFromRepo = _recordRepository.GetRecord(recordId);

            if (recordFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<RecordDto>(recordFromRepo));
        }

        // GET: api/Records/username/userId
        [HttpGet("username/{userId}")]
        public ActionResult<IEnumerable<RecordDto>> GetRecordsByUserName(string userId)
        {
            var recordsFromRepo = _recordRepository.GetRecordsFromUserId(userId);
            return Ok(_mapper.Map<IEnumerable<RecordDto>>(recordsFromRepo));
        }

        [HttpPost]
        public ActionResult<RecordDto> CreateRecord([FromForm] RecordForCreationDto recordToCreate)
        {
            if (Request.Form.Files.Count != 0)
            {
                var resizedImage = _imageService.ResizeImage(Request.Form.Files[0]);

                ImageUploadModel imageUploadResized = _imageService.uploadImage(resizedImage, "resized");
                ImageUploadModel imageUploadOriginal = _imageService.uploadImage(Request.Form.Files[0], "original");

                if (imageUploadResized.Status == 0 || imageUploadOriginal.Status == 0)
                {
                    ModelState.AddModelError(
                        "Description",
                        imageUploadOriginal.Path);
                    return BadRequest(ModelState);
                }
                recordToCreate.ImagePath = Request.Form.Files[0].FileName;
                recordToCreate.LastUpdatedTime = DateTime.Now;
            } 

            

            var recordEntity = _mapper.Map<Entities.Record>(recordToCreate);

            if (_recordRepository.RecordBandExists(recordEntity.Band))
            {
                ModelState.AddModelError(
                    "Description",
                    "The provided band already exists.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _recordRepository.AddRecord(recordEntity);
            _recordRepository.Save();

            var recordToReturn = _mapper.Map<RecordDto>(recordEntity);
            return CreatedAtRoute("GetRecord",
                new { recordId = recordToReturn.Id },
                recordToReturn);
        }

        [HttpPut("{recordId}")]
        public IActionResult UpdateRecord(int recordId,
            [FromForm] RecordForCreationDto recordToUpdate)
        {

            if (Request.Form.Files.Count != 0)
            {
                var resizedImage = _imageService.ResizeImage(Request.Form.Files[0]);

                ImageUploadModel imageUploadResized = _imageService.uploadImage(resizedImage, "resized");
                ImageUploadModel imageUploadOriginal = _imageService.uploadImage(Request.Form.Files[0], "original");

                if (imageUploadResized.Status == 0 || imageUploadOriginal.Status == 0)
                {
                    ModelState.AddModelError(
                        "Description",
                        imageUploadOriginal.Path);
                    return BadRequest(ModelState);
                }

                recordToUpdate.ImagePath = Request.Form.Files[0].FileName;
                
            }
            
            if (!_recordRepository.RecordExists(recordId))
            {
                return NotFound();
            }

            var recordFromRepo = _recordRepository.GetRecord(recordId);

            if (recordFromRepo == null)
            {
                var recordToAdd = _mapper.Map<Entities.Record>(recordToUpdate);
                recordToAdd.Id = recordId;
                recordToAdd.LastUpdatedTime = DateTime.Now;

                _recordRepository.AddRecord(recordToAdd);

                _recordRepository.Save();

                var recordToReturn = _mapper.Map<RecordDto>(recordToAdd);

                return CreatedAtRoute("GetRecord",
                    new { recordId = recordToReturn.Id },
                    recordToReturn);
            }

            recordToUpdate.LastUpdatedTime = DateTime.Now;
            recordToUpdate.CategoryName = "records";
            // map the entity to a RecordForUpdateDto
            // apply the updated field values to that dto
            // map the RecordForUpdateDto back to an entity
            _mapper.Map(recordToUpdate, recordFromRepo);

            _recordRepository.UpdateRecord(recordFromRepo);

            _recordRepository.Save();
            return CreatedAtRoute("GetRecord",
                new { recordId = recordFromRepo.Id },
                recordFromRepo);
        }

        // DELETE: api/Record/5
        [HttpDelete("{recordId}")]
        public ActionResult DeleteAuthor(int recordId)
        {
            var recordFromRepo = _recordRepository.GetRecord(recordId);

            if (recordFromRepo == null)
            {
                return NotFound();
            }

            _imageService.deleteFolder(recordFromRepo.ImagePath);
            _recordRepository.DeleteRecord(recordFromRepo);

            _recordRepository.Save();

            return NoContent();
        }
    }
}