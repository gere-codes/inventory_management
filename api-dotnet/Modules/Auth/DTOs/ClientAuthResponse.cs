public record ClientAuthResponseDto(
    string accessToken,
    UserResponseDto User
);