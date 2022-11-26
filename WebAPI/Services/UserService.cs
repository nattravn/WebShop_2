using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;

namespace WebAPI.Services
{
    public class UserService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public UserService(
            IHttpClientFactory httpClientFactory,
            ILogger<UserService> logger)
        {

            _httpClientFactory = httpClientFactory ??
                throw new ArgumentNullException(nameof(httpClientFactory));
        }
    }
}
