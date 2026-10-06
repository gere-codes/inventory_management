    
public interface IProductService
{
     Task<Product?> GetProductByIdAsync(Guid id);
     Task<IEnumerable<Product>> FindManyAndCountAsync();
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

        public async Task<IEnumerable<Product>> FindManyAndCountAsync()
        {
            return await _productRepository.FindManyAndCountAsync();
        }
    }