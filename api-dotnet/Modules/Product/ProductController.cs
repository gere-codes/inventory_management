using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    // public async Task<IActionResult> GetProductById(Guid id){}
    [HttpGet]
    public async Task<IActionResult> getCollection(bool isPaginated = true, int page = 1, int limit = 10, string search = null, string sortBy = "featured")
    {
        Console.WriteLine(isPaginated);
        var products = await _productService.FindManyAndCountAsync();
        return Ok(products);
    }


}