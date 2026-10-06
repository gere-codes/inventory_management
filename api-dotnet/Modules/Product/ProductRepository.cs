using Microsoft.EntityFrameworkCore;

public interface IProductRepository{
    Task<Product?> GetProductByIdAsync(Guid id);
    Task<IEnumerable<Product>> FindManyAndCountAsync();
}

internal class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetProductByIdAsync(Guid id)
    {
      return await _context.Products.FirstOrDefaultAsync<Product>((p) => p.Id == id);

    }

    public async Task<IEnumerable<Product>> FindManyAndCountAsync()
    {
        return await _context.Products.ToListAsync();
    }

}