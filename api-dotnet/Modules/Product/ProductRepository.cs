using Microsoft.EntityFrameworkCore;

public interface IProductRepository{
    Task<Product?> GetProductByIdAsync(Guid id);
    Task<TCollectionResult<Product>> FindManyAndCountAsync(ContextDto context, QueryDto query);
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

    public async Task<TCollectionResult<Product>> FindManyAndCountAsync(ContextDto context, QueryDto query)
    {
        IQueryable<Product> products = _context.Products.AsNoTracking();

        if(context.Scope != "Admin"){
            if(string.IsNullOrWhiteSpace(context.UserId)){
                return new TCollectionResult<Product>(
                    items:[],
                    pagination:new TPagination(
                        Page:1, 
                        Limit:query.Limit,
                        TotalItems:0,
                        TotalPages:0
                    )
                );

                var search = query.Search.Trim();
                products = products.Where(product => product.Name.Contains(search));
                ;
            }
        }


        

        var totalItems = await products.CountAsync();

        var limit = Math.Clamp(query.Limit, 1, 100);
        var requestedPage = Math.Max(query.Page, 1);

        var totalPages = query.IsPaginated
            ? (int)Math.Ceiling(totalItems / (double)limit)
            : totalItems > 0 ? 1 : 0;

        var normalizedPage = totalPages > 0
            ? Math.Min(requestedPage, totalPages)
            : 1;

        
        var pagination = new TPagination(
            Page: normalizedPage,
            Limit: limit,
            TotalItems: totalItems, 
            TotalPages: totalPages
        );

        products = query.SortBy.ToLower() switch
        {
            "priceAsc" => products.OrderBy(product => product.Price),

            "priceDesc" => products.OrderByDescending(product => product.Price),

            "featured" => products.OrderByDescending(product => product.CreatedAt),

            _ => products.OrderByDescending(product => product.CreatedAt),
        };


        if (query.IsPaginated)
        {
            products = products
                .Skip((normalizedPage - 1) * limit)
                .Take(limit);
        }

        var items  = await products.ToListAsync();


        var collection = new TCollectionResult<Product>(items, pagination);
        return collection;
    }

}