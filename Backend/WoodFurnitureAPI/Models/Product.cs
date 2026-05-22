
 
// ============================================================
//  Product.cs
// ============================================================
public class Product
{
    public int      ProductID    { get; set; }
    public int      CategoryID   { get; set; }
    public string?  CategoryName { get; set; }   // populated via JOIN
    public string   ProductName  { get; set; } = string.Empty;
    public string   SKU          { get; set; } = string.Empty;
    public string?  Description  { get; set; }
    public string?  Material     { get; set; }
    public string?  Dimensions   { get; set; }
    public decimal? WeightKG     { get; set; }
    public decimal  BasePrice    { get; set; }
    public int      StockQty     { get; set; }
    public int      ReorderLevel { get; set; }
    public bool     IsActive     { get; set; } = true;
    public DateTime CreatedAt    { get; set; }
    public DateTime UpdatedAt    { get; set; }
 
    // Helper
    public string StockStatus =>
        StockQty == 0             ? "Out of Stock" :
        StockQty <= ReorderLevel  ? "Low Stock"    : "In Stock";
}
 