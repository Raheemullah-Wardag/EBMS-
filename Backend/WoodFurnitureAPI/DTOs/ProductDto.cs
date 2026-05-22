// Sent to React — product list / detail
public class ProductResponseDto
{
    public int     ProductID    { get; set; }
    public string  ProductName  { get; set; } = string.Empty;
    public string  SKU          { get; set; } = string.Empty;
    public string? CategoryName { get; set; }
    public string? Material     { get; set; }
    public string? Dimensions   { get; set; }
    public decimal BasePrice    { get; set; }
    public int     StockQty     { get; set; }
    public string  StockStatus  { get; set; } = string.Empty;
    public string? Description  { get; set; }
    public List<ProductImageDto>? Images { get; set; }
}
 
// Received from React — create or update product
public class ProductCreateDto
{
    public int     CategoryID  { get; set; }
    public string  ProductName { get; set; } = string.Empty;
    public string  SKU         { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Material    { get; set; }
    public string? Dimensions  { get; set; }
    public decimal BasePrice   { get; set; }
    public int     StockQty    { get; set; }
    public int     ReorderLevel { get; set; }
    
}
 