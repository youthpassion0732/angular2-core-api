using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlogCoreApi
{
    public enum RequestState
    {
        Failed = -1,
        NotAuth = 0,
        Success = 1
    }
}
