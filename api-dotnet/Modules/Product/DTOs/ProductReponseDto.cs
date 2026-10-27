
    public class ProductResponseDtos
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }
        public string CategoryId { get; set; }
        public SharedModels.Category Category { get; set; }
        public List<string> Images { get; set; }
        public string Status { get; set; }
        public string CreatedAt { get; set; }
        public string updatedAt { get; set; }
    }

