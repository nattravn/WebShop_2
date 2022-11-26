using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();

            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    var environment = builderContext.HostingEnvironment;

                    config
                        .SetBasePath(environment.ContentRootPath)
                        .AddJsonFile($"appsettings.json", optional: false, reloadOnChange: true)
                        .AddJsonFile($"secrets.json", optional: false, reloadOnChange: true)
                        .AddEnvironmentVariables();
                })
                .UseStartup<Startup>();
    }
}
