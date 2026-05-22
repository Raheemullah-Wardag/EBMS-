public class ProductService
{
    private readonly ProductRepository _repo;

    public ProductService(ProductRepository repo)
    {
        _repo = repo;
    }

    public List<ProductResponseDto> GetAll()
    {
        return _repo.GetAll().Select(MapToDto).ToList();
    }

    public ProductResponseDto? GetByID(int id)
    {
        var product = _repo.GetByID(id);
        if (product == null) return null;

        var dto = MapToDto(product);
        dto.Images = GetImages(id);
        return dto;
    }

    public int Create(ProductCreateDto dto)
    {
        var product = new Product
        {
            CategoryID   = dto.CategoryID,
            ProductName  = dto.ProductName,
            SKU          = dto.SKU,
            Description  = dto.Description,
            Material     = dto.Material,
            Dimensions   = dto.Dimensions,
            BasePrice    = dto.BasePrice,
            StockQty     = dto.StockQty,
            ReorderLevel = dto.ReorderLevel
        };
        return _repo.Create(product);
    }

    public bool Update(int id, ProductCreateDto dto)
    {
        var existing = _repo.GetByID(id);
        if (existing == null) return false;

        existing.CategoryID   = dto.CategoryID;
        existing.ProductName  = dto.ProductName;
        existing.Description  = dto.Description;
        existing.Material     = dto.Material;
        existing.Dimensions   = dto.Dimensions;
        existing.BasePrice    = dto.BasePrice;
        existing.ReorderLevel = dto.ReorderLevel;
        existing.StockQty = dto.StockQty;

        _repo.Update(existing);
        return true;
    }

    public bool Delete(int id)
    {
        var existing = _repo.GetByID(id);
        if (existing == null) return false;

        _repo.Delete(id);
        return true;
    }

    // ── Image methods ──────────────────────────────────────
    public List<ProductImageDto> GetImages(int productId)
    {
        return _repo.GetImagesByProductID(productId).Select(i => new ProductImageDto
        {
            ImageID   = i.ImageID,
            ImagePath = i.ImagePath,
            AltText   = i.AltText,
            IsMain    = i.IsMain,
            SortOrder = i.SortOrder
        }).ToList();
    }

    public void AddImage(int productId, string imagePath, string? altText, bool isMain, int sortOrder)
    {
        _repo.AddImage(productId, imagePath, altText, isMain, sortOrder);
    }

    public void DeleteImage(int imageId)
    {
        _repo.DeleteImage(imageId);
    }

    // ── Mapper ─────────────────────────────────────────────
    private ProductResponseDto MapToDto(Product p) => new ProductResponseDto
    {
        ProductID    = p.ProductID,
        ProductName  = p.ProductName,
        SKU          = p.SKU,
        CategoryName = p.CategoryName,
        Material     = p.Material,
        Dimensions   = p.Dimensions,
        BasePrice    = p.BasePrice,
        StockQty     = p.StockQty,
        StockStatus  = p.StockStatus,
        Description  = p.Description
    };
}