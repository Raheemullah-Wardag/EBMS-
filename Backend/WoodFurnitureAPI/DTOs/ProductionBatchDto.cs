
public class ProductionBatchResponseDto
{
    public int      BatchID        { get; set; }
    public string   BatchName      { get; set; } = string.Empty;
    public string   Status         { get; set; } = string.Empty;
    public DateTime? StartDate     { get; set; }
    public DateTime? EndDate       { get; set; }
    public string?  AssignedToName { get; set; }
    public int?     OrderID        { get; set; }
    public string?  CustomerName   { get; set; }
    public string?  OrderStatus    { get; set; }
}
 
public class CreateProductionBatchDto
{
    public int?    OrderID         { get; set; }
    public string  BatchName       { get; set; } = string.Empty;
    public DateTime StartDate      { get; set; }
    public DateTime EndDate        { get; set; }
    public int     AssignedTo      { get; set; }
    public int?    ProductID       { get; set; }
    public int?    SpecID          { get; set; }
    public int     QuantityPlanned { get; set; }
}
 
public class UpdateBatchStatusDto
{
    public string NewStatus    { get; set; } = string.Empty;
    public int    QuantityMade { get; set; }
}