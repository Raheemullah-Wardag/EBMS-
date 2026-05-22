using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductController(ProductService productService)
    {
        _productService = productService;
    }

    // GET /api/products
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetAll()
    {
        var products = _productService.GetAll();
        return Ok(products);
    }

    // GET /api/products/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public IActionResult GetByID(int id)
    {
        var product = _productService.GetByID(id);
        if (product == null)
            return NotFound(new { message = "Product not found." });

        return Ok(product);
    }

    // POST /api/products
    [HttpPost]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult Create([FromBody] ProductCreateDto dto)
    {
        var newId = _productService.Create(dto);
        return Ok(new { message = "Product created.", productId = newId });
    }

    // PUT /api/products/5
    [HttpPut("{id}")]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult Update(int id, [FromBody] ProductCreateDto dto)
    {
        var success = _productService.Update(id, dto);
        if (!success)
            return NotFound(new { message = "Product not found." });

        return Ok(new { message = "Product updated." });
    }

    // DELETE /api/products/5
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Delete(int id)
    {
        var success = _productService.Delete(id);
        if (!success)
            return NotFound(new { message = "Product not found." });

        return Ok(new { message = "Product deleted." });
    }

    // POST /api/products/5/images
    [HttpPost("{id}/images")]
    [Authorize(Policy = "ManagerUp")]
    public async Task<IActionResult> UploadImage(
        int id,
        IFormFile file,
        [FromQuery] string? altText,
        [FromQuery] bool isMain = false,
        [FromQuery] int sortOrder = 0)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        // allowed extensions only
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLower();
        if (!allowed.Contains(ext))
            return BadRequest(new { message = "Only jpg, png, webp allowed." });

        // save to wwwroot/images/products/{productId}/
        var folder = Path.Combine("wwwroot", "images", "products", id.ToString());
        Directory.CreateDirectory(folder);

        var fileName  = $"{Guid.NewGuid()}{ext}";
        var filePath  = Path.Combine(folder, fileName);
        var imagePath = $"images/products/{id}/{fileName}";

        using (var stream = new FileStream(filePath, FileMode.Create))
            await file.CopyToAsync(stream);

        _productService.AddImage(id, imagePath, altText, isMain, sortOrder);

        return Ok(new { message = "Image uploaded.", imagePath });
    }

    // GET /api/products/5/images
    [HttpGet("{id}/images")]
    [AllowAnonymous]
    public IActionResult GetImages(int id)
    {
        var images = _productService.GetImages(id);
        return Ok(images);
    }

    // DELETE /api/products/images/5
    [HttpDelete("images/{imageId}")]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult DeleteImage(int imageId)
    {
        _productService.DeleteImage(imageId);
        return Ok(new { message = "Image deleted." });
    }
}