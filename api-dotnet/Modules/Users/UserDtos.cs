using System.ComponentModel.DataAnnotations;

public record CreateUserDto(
    [Required, MaxLength(100)] string Name,
    [Required, EmailAddress, MaxLength(100)] string Email,
    [Required, MaxLength(255)] string Password
);


public record ResponseUserDto(
    Guid Id,
    string Name,
    string Email,
    DateTime UpdatedAt
);