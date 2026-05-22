// ============================================================
//  RawMaterial.cs
// ============================================================
public class RawMaterial
{
    public int      MaterialID   { get; set; }
    public string   MaterialName { get; set; } = string.Empty;
    public string   Unit         { get; set; } = string.Empty;
    public decimal  StockQty     { get; set; }
    public decimal  ReorderLevel { get; set; }
    public decimal  CostPerUnit  { get; set; }
    public string?  Supplier     { get; set; }
    public DateTime UpdatedAt    { get; set; }
 
    public string StockStatus =>
        StockQty == 0            ? "Out of Stock" :
        StockQty <= ReorderLevel ? "Low Stock"    : "In Stock";
}