public class AppError : Exception
{
    public int StatusCode { get; }

    public AppError(string message, int statusCode, bool isOperational = true) : base(message)
    {
        StatusCode = statusCode;
        Data["isOperational"] = isOperational;
    }
}

public class BadRequestError : AppError
{
    public BadRequestError(string message = "Bad Request") : base(message, 400)
    {
    }
}

public class NotAuthorizedError : AppError
{
    public NotAuthorizedError(string message = "Not Authorized") : base(message, 401)
    {
    }
}

public class ForbiddenError : AppError
{
    public ForbiddenError(string message = "Forbidden Access") : base(message, 403)
    {
    }
}

public class NotFoundError : AppError
{
    public NotFoundError(string message = "Not Found") : base(message, 404)
    {
    }
}

public class ConflictError : AppError
{
    public ConflictError(string message = "Conflict") : base(message, 409)
    {
    }
}
