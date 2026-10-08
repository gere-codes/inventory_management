    
public interface IProductService
{
     Task<Product?> GetProductByIdAsync(Guid id);
     Task<TCollectionResult<Product>> FindManyAndCountAsync(ContextDto context, QueryDto query);
}
    
public class ProductService : IProductService
    
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Product?> GetProductByIdAsync(Guid id)
        {
            return await _productRepository.GetProductByIdAsync(id);
        }

        public async Task<TCollectionResult<Product>> FindManyAndCountAsync(ContextDto context, QueryDto query)
        {
            return await _productRepository.FindManyAndCountAsync(context, query);
        }
    }