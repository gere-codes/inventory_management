public class AuthResponseDTO
{
    public string Token { get; set; }
    public string Refresh { get; set; }
    public UserResponseDto User { get; set; }
}