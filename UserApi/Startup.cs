using AutoMapper;
using UserApi.Entities;
using UserApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Azure;
using WebAPI.Constants;
using System.Collections.Generic;
using Azure.Security.KeyVault.Secrets;
using Azure.Core;
using Azure.Identity;
using UserApi.Models;

namespace UserApi
{
    public class Startup
    {
        /// <summary>
		/// The hosting environment.
		/// </summary>
		private readonly IWebHostEnvironment _environment;

        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));

            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Inject AppSettings
            services.Configure<ApplicationSettings>(_configuration.GetSection("ApplicationSettings"));

            services.AddControllers(setupAction =>
            {
                setupAction.ReturnHttpNotAcceptable = true;

            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }).AddXmlDataContractSerializerFormatters()
            .ConfigureApiBehaviorOptions(setupAction => {
                setupAction.InvalidModelStateResponseFactory = context =>
                {
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Type = "https://courselibrary.com/modelvalidationproblem",
                        Title = "One or more model validation errors occurred.",
                        Status = StatusCodes.Status422UnprocessableEntity,
                        Detail = "See the errors property for details.",
                        Instance = context.HttpContext.Request.Path
                    };

                    problemDetails.Extensions.Add("traceId", context.HttpContext.TraceIdentifier);

                    return new UnprocessableEntityObjectResult(problemDetails)
                    {
                        ContentTypes = { "application/problem+json" }
                    };
                };
            });

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            //
            var connectionString = _configuration["ConnectionStrings:IdentityConnection"];

            // AuthenticationContext cant use self made db-context must use this kind:
           // services.AddDbContext<AuthenticationContext>(option => option.UseSqlServer(connectionString));
            //services.AddDbContext<UserdbContext>(option => option.UseSqlServer(connectionString));
            ConfigureDBContext(services);

            // User identity injection
            // This can only take a IdentityUser, ApplicationUser inherit IdentityUser!!!
            services.AddDefaultIdentity<ApplicationUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<AuthenticationContext>();

            //Password requirements
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 4;

                // User settings.
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";
                options.User.RequireUniqueEmail = false;
            });

            services.AddScoped<IApplicationUserRepository, ApplicationUserRepository>();

            //JWt Authentication

            var key = Encoding.UTF8.GetBytes(_configuration["ApplicationSettings:JWT_Secret"].ToString());
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = false;
                x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
            });
        }

        private void ConfigureDBContext(IServiceCollection services)
        {
            var connectionKey = $"{ConfigurationKeys.UserDBConnectionStringsSettingsPath}_{_environment.EnvironmentName}";

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
                connectionString = string.Format(connectionString.ToString(), userIdString, passwordString);

                //_password = userIdString;
            }

            var optionsBuilder = new DbContextOptionsBuilder<AuthenticationContext>();
            optionsBuilder.UseSqlServer(connectionString);

            services.AddDbContext<AuthenticationContext>(option => option.UseSqlServer(connectionString));

            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

            //services.AddSingleton<Func<RecorddbContext>>(serviceProvider => () => new RecorddbContext(optionsBuilder.Options));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
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
            }

            app.UseCors(builder =>
            builder.WithOrigins(_configuration["ApplicationSettings:Client_URL"].ToString())
            .AllowAnyHeader()
            .AllowAnyOrigin()
            .AllowAnyMethod());

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
