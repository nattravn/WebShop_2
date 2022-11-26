using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebAPI.Filter
{
    public class CategoriesResultFilterAttribute : ResultFilterAttribute
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

            //var config = new MapperConfiguration(cfg => cfg.CreateMap<Entities.Categories, IEnumerable<Models.Category>>());
            //var Mapper = config.CreateMapper();
            var _mapper = context.HttpContext.RequestServices.GetService<IMapper>();
            /*
            var config = new MapperConfiguration(cfg => {
                cfg.AddProfile<CategoriesProfile>();
                cfg.CreateMap<Entities.Categories, Models.Category>();
            });*/

            //var mapper = config.CreateMapper();

            resultFromAction.Value = _mapper.Map<ICollection<Models.CategoryDto>>(resultFromAction.Value);

            await next();
        }
    }
}
