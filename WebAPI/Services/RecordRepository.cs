using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.Extensions;
using WebAPI.Models;
using WebAPI.ResourceParameters;

namespace WebAPI.Services
{
    public class RecordRepository : IRecordRepository, IDisposable
    {
        private RecorddbContext _context;

        public RecordRepository(RecorddbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public Record GetRecord(int recordId)
        {
            return _context.Records.FirstOrDefault(r => r.Id == recordId);
        }

        public IEnumerable<Record> GetRecords()
        {
            return _context.Records.ToList<Record>();
        }

        public IEnumerable<Record> GetRecords(RecordResourceParameters recordsResourceParameters)
        {
            if (recordsResourceParameters == null)
            {
                throw new ArgumentNullException(nameof(recordsResourceParameters));
            }

            if (string.IsNullOrWhiteSpace(recordsResourceParameters.Band)
                 && string.IsNullOrWhiteSpace(recordsResourceParameters.SearchQuery))
            {
                return GetRecords();
            }

            var collection = _context.Records as IQueryable<Record>;

            if (!string.IsNullOrWhiteSpace(recordsResourceParameters.Band))
            {
                var recordName = recordsResourceParameters.Band.Trim();
                collection = collection.Where(a => a.Band == recordName);
            }

            if (!string.IsNullOrWhiteSpace(recordsResourceParameters.SearchQuery))
            {

                var searchQuery = recordsResourceParameters.SearchQuery.Trim();
                collection = collection.Where(a => a.Band.Contains(searchQuery)
                    || a.Band.Contains(searchQuery));
            }

            return collection.ToList();
        }

        public bool RecordExists(int recordId)
        {
            return _context.Records.Any(r => r.Id == recordId);
        }

        public bool RecordBandExists(string recordBand)
        {
            return _context.Records.Any(r => r.Band == recordBand);
        }

        public void AddRecord(Record recordToAdd)
        {
            if (recordToAdd == null)
            {
                throw new ArgumentException("Record is null");
            }

            recordToAdd.Id = _context.Records.OrderByDescending(r => r.Id).First().Id +1;
            recordToAdd.CategoryId = _context.Records.FirstOrDefault().CategoryId;
            recordToAdd.CategoryName = _context.Records.FirstOrDefault().CategoryName;

            _context.Records.Add(recordToAdd);
        }

        public void DeleteRecord(Record record)
        {
            if (record == null)
            {
                throw new ArgumentNullException(nameof(record));
            }

            _context.Records.Remove(record);
        }

        public bool Save()
        {
            return (_context.SaveChanges() >= 0);
        }

        public void UpdateRecord(Record record)
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

        public IEnumerable<Record> GetRecordsFromUserId(string userId)
        {
            return _context.Records.Where(r => r.UserId == userId).ToList();
        }

        public async Task<GetTableListResponseDto<RecordDto>> GetRecordWithParams(int limit, int page, CancellationToken cancellationToken)
        {
            var records = await _context.Records
                           .AsNoTracking()
                           .OrderBy(p => p.Id)
                           .PaginateAsync(page, limit, cancellationToken);

            return new GetTableListResponseDto<RecordDto>
            {
                CurrentPage = records.CurrentPage,
                TotalPages = records.TotalPages,
                TotalItems = records.TotalItems,
                Items = records.Items.Select(p => new RecordDto
                {
                    Id = p.Id,
                    Album = p.Album,
                    Band = p.Band,
                    CategoryName = p.CategoryName,
                    Description = p.Description,
                    Genre = p.Genre,
                    ImagePath = p.ImagePath,
                    Price = p.Price.GetValueOrDefault(),
                    subCategoryId = p.SubCategoryId.GetValueOrDefault(),
                    CategoryId = p.CategoryId.GetValueOrDefault(),
                    Title = p.Title,
                    Year = p.Year,
                    UserId = p.UserId
                }).ToList()
            };
        }
    }
}

