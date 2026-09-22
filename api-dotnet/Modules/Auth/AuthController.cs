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
    public async Task<ActionResult<RefreshClientResponseDTO>> Refresh()
        {

            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
        {
            return Unauthorized(new { message = "Refresh token is missing." });
        }

        var newAccessToken = await _authService.RefreshAsync(refreshToken);

        if (newAccessToken == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        return Ok(new { accessToken = newAccessToken });
        }
    }