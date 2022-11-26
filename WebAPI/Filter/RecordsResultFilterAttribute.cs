using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebAPI.Filter
{
    public class RecordsResultFilterAttribute : ResultFilterAttribute
    {
        public override async Task OnResultExecutionAsync(
            ResultExecutingContext context,
            ResultExecutionDelegate next)
        {

            var resultFromAction = context.Result as ObjectResult;
            if (resultFromAction?.Value == null
                || resultFromAction.StatusCode < 200
                || resultFromAction.StatusCode >= 300)
            {
                await next();
                return;
            }

            var config = new MapperConfiguration(cfg => cfg.CreateMap<Entities.Record, Models.RecordDto>());
            var Mapper = config.CreateMapper();
            //var _mapper = context.HttpContext.RequestServices.GetService<IMapper>();
            resultFromAction.Value = Mapper.Map<IEnumerable<Models.RecordDto>>(resultFromAction.Value);

            await next();
        }
    }
}
