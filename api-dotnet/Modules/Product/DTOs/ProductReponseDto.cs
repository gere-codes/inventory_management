
using Microsoft.VisualBasic;

public class ProductResponseDtos
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }

        public string CategoryId { get; set; } = string.Empty;
        public CategoryResponseDto Category { get; set; } = new();

        public List<string> Images { get; set; }
        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

