using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginRequestDTO loginData)
    {
        var result = await _authService.LoginAsync(loginData);

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

    [HttpPost("refresh")]
    [Authorize] 
    public async Task<ActionResult<RefreshClientResponseDTO>> Refresh()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                            ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid token payload.");
            }

            var result = await _authService.RefreshAsync(userId);

            return Ok(new RefreshClientResponseDTO(result.AccessToken));
        }
    }