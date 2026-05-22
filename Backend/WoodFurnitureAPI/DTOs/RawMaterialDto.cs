 
public class RawMaterialResponseDto
{
    public int     MaterialID   { get; set; }
    public string  MaterialName { get; set; } = string.Empty;
    public string  Unit         { get; set; } = string.Empty;
    public decimal StockQty     { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal CostPerUnit  { get; set; }
    public string? Supplier     { get; set; }
    public string  StockStatus  { get; set; } = string.Empty;
}
 
public class RawMaterialCreateDto
{
    public string  MaterialName { get; set; } = string.Empty;
    public string  Unit         { get; set; } = string.Empty;
    public decimal StockQty     { get; set; }
    public decimal ReorderLevel { get; set; }
    public decimal CostPerUnit  { get; set; }
    public string? Supplier     { get; set; }
}
