using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class RecordForCreationDto : BaseProduct
    {
        public string Genre { get; set; }
        public string Band { get; set; }
        public string Album { get; set; }
    }
}
