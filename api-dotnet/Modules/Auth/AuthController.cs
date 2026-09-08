using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDTO>> Register([FromBody] RegisterRequestDTO registerData)
    {
        var result = await _authService.RegisterAsync(registerData);
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,                
            Secure = true,                  
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7) 
        };

        Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);

        var clientResponse = new ClientAuthResponseDto(result.AccessToken, result.User);

        return Ok(clientResponse);
        
    }
}