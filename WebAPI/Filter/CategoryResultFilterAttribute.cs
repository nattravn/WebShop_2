using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace WebAPI.Filter
{
    public class CategoryResultFilterAttribute: ResultFilterAttribute
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
            //var config = new MapperConfiguration(cfg => cfg.CreateMap<Entities.Categories, Models.Category>());
            //var Mapper = config.CreateMapper();
            var _mapper = context.HttpContext.RequestServices.GetService<IMapper>();
            resultFromAction.Value = _mapper.Map<Models.CategoryDto>(resultFromAction.Value);

           await next();
        }
    }
}
