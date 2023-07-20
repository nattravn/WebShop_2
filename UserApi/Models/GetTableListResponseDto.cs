using System.Collections.Generic;

namespace WebAPI.Models
{
    public class GetTableListResponseDto<T>
    {
        public int CurrentPage { get; init; }

        public int TotalItems { get; init; }

        public int TotalPages { get; init; }

        public List<T> Items { get; init; }

        //public IDictionary<LinkedResourceType, LinkedResource> Links { get; set; }
    }
}
