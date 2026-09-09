

using System.ComponentModel.DataAnnotations;

public class RefreshRequestDTO
{
    [Required]
    [StringLength(64)]
    public string UserId {get; set;}

}