 
// ============================================================
//  OrderItem.cs
// ============================================================
public class OrderItem
{
    public int     OrderItemID { get; set; }
    public int     OrderID     { get; set; }
    public int     ProductID   { get; set; }
    public string? ProductName { get; set; }   // populated via JOIN
    public string? SKU         { get; set; }
    public int     Quantity    { get; set; }
    public decimal UnitPrice   { get; set; }
    public decimal LineTotal   { get; set; }   // computed in DB
}