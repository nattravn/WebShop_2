using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.ResourceParameters
{
    public class UrlQueryParameters
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public string Key { get; set; }
        public string Order { get; set; }
    }
}
