using System.Security.Cryptography;

namespace BlogCoreApi
{
    public class RSAKeyHelper
    {
        public static RSAParameters GenerateKey()
        {
            using (var key = RSA.Create())
            {
                key.KeySize = 2048;
                return key.ExportParameters(true);
            }
        }
    }
}
