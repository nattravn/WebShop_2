using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using WebAPI.Services;
using WebAPI.Entities;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Hosting;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebAPI.Constants;
using Azure.Security.KeyVault.Secrets;
using Azure.Core;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Azure.KeyVault;
using System.Diagnostics;
using Microsoft.Data.SqlClient;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.OpenApi.Models;

namespace WebAPI
{
    public class Startup
    {
        /// <summary>
		/// The hosting environment.
		/// </summary>
		private readonly IWebHostEnvironment _environment;

        private readonly IConfiguration _configuration;

        private string _password = "x";

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));

            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(setupAction =>
            {
                setupAction.ReturnHttpNotAcceptable = true;

            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }).AddXmlDataContractSerializerFormatters();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddScoped<IRecordRepository, RecordRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ISubCategoryRepository, SubCategoryRepository>();
            services.AddScoped<IClothingRepository, ClothingRepository>();
            services.AddScoped<IShoeRepository, ShoeRepository>();
            services.AddScoped<ImageService>();
            services.AddScoped<UserService>();
            services.AddSingleton<ValueService>();

            ConfigureDBContext(services);

            services.AddHttpClient();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "ToDo API",
                    Description = "A simple example ASP.NET Core Web API",
                });
            });
        }

        private void ConfigureDBContext(IServiceCollection services)
        {
            var connectionKey = $"{ConfigurationKeys.RecordDBConnectionStringsSettingsPath}_{_environment.EnvironmentName}";

            var connectionString = _configuration[connectionKey]
                ?? throw new KeyNotFoundException($"Could not found database connection string\"{connectionKey}\".");

            if (_environment.EnvironmentName == "Production")
            {
                SecretClientOptions options = new SecretClientOptions()
                {
                    Retry =
                {
                    Delay= TimeSpan.FromSeconds(2),
                    MaxDelay = TimeSpan.FromSeconds(16),
                    MaxRetries = 5,
                    Mode = RetryMode.Exponential
                    }
                };
                var client = new SecretClient(new Uri("https://recordapisecret.vault.azure.net/"), new DefaultAzureCredential(), options);

                KeyVaultSecret password = client.GetSecret("sqlServerPassword");
                KeyVaultSecret userId = client.GetSecret("UserId");

                string passwordString = password.Value;
                string userIdString = userId.Value;

                var formatString = connectionString.ToString();
                connectionString = string.Format(connectionString.ToString(), userIdString, passwordString );

                //_password = userIdString;
            }

            var optionsBuilder = new DbContextOptionsBuilder<RecorddbContext>();
            optionsBuilder.UseSqlServer(connectionString);
            services.AddDbContext<RecorddbContext>(option => option.UseSqlServer(connectionString));

            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

            //services.AddSingleton<Func<RecorddbContext>>(serviceProvider => () => new RecorddbContext(optionsBuilder.Options));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ValueService valueService)
        {
            valueService.setSecretValue(_password);

            // To display images from wwwroot
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("swagger/v1/swagger.json", "WebShop API (v1)");
                    // serve UI at root
                    c.RoutePrefix = string.Empty;
                });

            }
            else
            {
                app.UseExceptionHandler(appBuilder =>
                {
                    appBuilder.Run(async context =>
                    {
                        context.Response.StatusCode = 500;
                        await context.Response.WriteAsync("An unexpected fault happened. Try again later.");
                    });
                });
                app.UseHsts();
            }

            //app.UseStaticFiles();

            app.UseCors(builder =>
                builder.WithOrigins(_configuration["ApplicationSettings:Client_URL"].ToString()
            )
            .AllowAnyHeader()
            .AllowAnyOrigin()
            .AllowAnyMethod());

            app.UseRouting();

            //app.UseAuthorization();
            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hosting environment: " + env.EnvironmentName);
            });
        }
    }
}
