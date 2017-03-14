using Microsoft.IdentityModel.Tokens;
using System;

namespace BlogCoreApi
{
    public class TokenAuthOption
    {
        public static string Audience { get; } = "http://localhost:62147";
        public static string Issuer { get; } = "BlogCoreApi";
        public static RsaSecurityKey Key { get; } = new RsaSecurityKey(RSAKeyHelper.GenerateKey());
        public static SigningCredentials SigningCredentials { get; } = new SigningCredentials(Key, SecurityAlgorithms.RsaSha256Signature);

        public static TimeSpan ExpiresSpan { get; } = TimeSpan.FromMinutes(40);
        public static string TokenType { get; } = "Bearer";
    }
}
