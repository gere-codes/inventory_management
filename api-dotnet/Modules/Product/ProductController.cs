using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
    // [Authorize]
    [HttpGet]
    [Route("collection")]
    public async Task<IActionResult> getCollection(bool isPaginated = true, int page = 1, int limit = 10, string? search = null, string sortBy = "featured")
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userRole = User.FindFirstValue(ClaimTypes.Role);

        var options = new QueryDto(isPaginated, page, limit, search, sortBy);
        var context = new ContextDto(userId, userRole);

        var products = await _productService.FindManyAndCountAsync(context, options);
        return Ok(products);
    }


}