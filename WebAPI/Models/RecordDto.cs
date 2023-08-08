using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class RecordDto : BaseProduct
    {
        public string Band { get; set; }
        public string Album { get; set; }
        public string Genre { get; set; }
    }
}
