
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

public interface IAuthService{
    Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO registerData);
    Task<AuthResponseDTO> LoginAsync(LoginRequestDTO loginData);
}
 class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IConfiguration _configuration;


    public AuthService(IAuthRepository authRepository, IConfiguration configuration )
    {
        _authRepository = authRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO registerData)
    
    {

            if (registerData.Password != registerData.ConfirmPassword)
            {
                throw new ArgumentException("Passwords do not match.");
            }

            var existingUser = await _authRepository.FindByEmailAsync(registerData.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException("A user with this email already exists.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerData.Password, workFactor: 12);

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Name = registerData.Name,
                Email = registerData.Email,
                Password = passwordHash, 
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _authRepository.CreateAsync(newUser);

            var accessToken = GenerateToken(newUser.Id.ToString(), "Jwt:AccessTokenKey", TimeSpan.FromMinutes(15));
            var refreshToken = GenerateToken(newUser.Id.ToString(), "Jwt:RefreshTokenKey", TimeSpan.FromDays(7));

            return new AuthResponseDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserResponseDto(
                    newUser.Id,
                    newUser.Name,
                    newUser.Email,
                    newUser.UpdatedAt
                )
            };
                       
    }

    public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO loginData)
    {
        const string dummyHash = "$2b$10$K9RP.S9f0jNo9NfS9NfS9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe";

        var existingUser = await _authRepository.FindByEmailAsync(loginData.Email);
        
        string hashedPassword = existingUser?.Password ?? dummyHash;
        bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginData.Password, hashedPassword);

        if (existingUser == null || !isValidPassword)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var accessToken = GenerateToken(existingUser.Id.ToString(), "Jwt:AccessTokenKey", TimeSpan.FromMinutes(15));
        var refreshToken = GenerateToken(existingUser.Id.ToString(), "Jwt:RefreshTokenKey", TimeSpan.FromDays(7));

        return new AuthResponseDTO
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserResponseDto(
                existingUser.Id,
                existingUser.Name,
                existingUser.Email,
                existingUser.UpdatedAt
            )
        };
    }
    


   private string GenerateToken(string userId, string configKey, TimeSpan expiration)
    {
        var secretKey = _configuration[configKey] ?? throw new InvalidOperationException($"{configKey} not configured.");
        var key = Encoding.UTF8.GetBytes(secretKey);

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim(JwtRegisteredClaimNames.Sub, userId) }),
            Expires = DateTime.UtcNow.Add(expiration),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
