using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using DomainEntities;
using DAL;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BlogCoreApi
{
    // reference: https://chsakell.com/2016/06/23/rest-apis-using-asp-net-core-and-entity-framework-core/
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // reference: https://code.msdn.microsoft.com/How-to-authorization-914d126b/sourcecode?fileId=163129&pathId=87568518
        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            // Add application-insight service
            services.AddApplicationInsightsTelemetry(Configuration);

            // Add identity service
            services.AddIdentity<User, IdentityRole>()
                    .AddEntityFrameworkStores<BlogContext>()
                    .AddDefaultTokenProviders();

            // Enable the use of an [Authorize("Bearer")] attribute on methods and classes to protect. 
            services.AddAuthorization(auth =>
            {
                auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme‌​)
                    .RequireAuthenticatedUser().Build());
            });

            // Add mvc service to the services container.
            services.AddMvc().AddJsonOptions(opts =>
            {
                // Force camel case to json
                opts.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            // register db context and specifying migration assembly.
            services.AddDbContext<BlogContext>(dbOptions => dbOptions.UseSqlServer(Configuration["DefaultConnection:ConnectionString"],
                                               sqlDBOptions => sqlDBOptions.MigrationsAssembly("BlogCoreApi")));

            // register repositeries
            services.AddTransient(typeof(IGenericRepositery<>), typeof(GenericRepositery<>));
            services.AddTransient<IAuthRepository, AuthRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseApplicationInsightsRequestTelemetry();
            app.UseApplicationInsightsExceptionTelemetry();

            // add exception handling to the request pipeline
            app.UseExceptionHandler(appBuilder =>
            {
                appBuilder.Use(async (context, next) =>
                {
                    var error = context.Features[typeof(IExceptionHandlerFeature)] as IExceptionHandlerFeature;

                    //when authorization has failed, should retrun a json message to client 
                    if (error != null && error.Error is SecurityTokenExpiredException)
                    {
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";

                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new RequestResult
                        {
                            State = RequestState.NotAuth,
                            Msg = "token expired"
                        }));
                    }
                    //when orther error, retrun a error message json to client 
                    else if (error != null && error.Error != null)
                    {
                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new RequestResult
                        {
                            State = RequestState.Failed,
                            Msg = error.Error.Message
                        }));
                    }
                    //when no error, do next. 
                    else await next();
                });
            });

            // Add jwt bearer authentication to the request pipeline 
            app.UseJwtBearerAuthentication(new JwtBearerOptions()
            {
                TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = TokenAuthOption.Key,
                    ValidAudience = TokenAuthOption.Audience,
                    ValidIssuer = TokenAuthOption.Issuer,
                    // When receiving a token, check that we've signed it. 
                    ValidateIssuerSigningKey = true,
                    // When receiving a token, check that it is still valid. 
                    ValidateLifetime = true,
                    // This defines the maximum allowable clock skew - i.e. provides a tolerance on the token expiry time  
                    // when validating the lifetime. As we're creating the tokens locally and validating them on the same  
                    // machines which should have synchronised time, this can be set to zero. Where external tokens are 
                    // used, some leeway here could be useful. 
                    ClockSkew = TimeSpan.FromMinutes(0)
                }
            });

            // Add cors to the request pipeline
            app.UseCors(builder =>
                        builder.AllowAnyOrigin()
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials()
                        );

            // Add identity to the request pipeline
            app.UseIdentity();

            // Add mvc to the request pipeline
            app.UseMvc();
        }
    }
}
