using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("categories")]
public class Category
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("user_id")]
    public Guid? UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    [Column("name")]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [Column("slug")]
    [MaxLength(100)]
    public string slug { get; set; }

    [Column("description")]
    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [Column("created_at", TypeName = "timestamp")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at", TypeName = "timestamp")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}