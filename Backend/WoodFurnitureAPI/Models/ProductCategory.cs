
// ============================================================
//  ProductCategory.cs
// ============================================================
public class ProductCategory
{
    public int     CategoryID   { get; set; }
    public string  CategoryName { get; set; } = string.Empty;
    public string? Description  { get; set; }
    public int?    ParentID     { get; set; }
}