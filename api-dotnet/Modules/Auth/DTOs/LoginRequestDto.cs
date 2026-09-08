using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public class LoginRequestDTO
{

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [PasswordPropertyText]
    public string Password {get; set;}
}