using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Entities;
using WebAPI.ResourceParameters;

namespace WebAPI.Services
{
    public interface IRecordRepository
    {
        Record GetRecord(int recordId);
        IEnumerable<Record> GetRecords();
        IEnumerable<Record> GetRecordsFromUserId(string userId);
        IEnumerable<Record> GetRecords(RecordResourceParameters recordsResourceParameters);
        bool RecordExists(int recordId);
        bool RecordBandExists(string recordBand);
        void AddRecord(Record record);
        void UpdateRecord(Record record);
        void DeleteRecord(Record record);
        bool Save();
    }
}
