 
// ============================================================
//  Order.cs
// ============================================================
public class Order
{
    public int      OrderID      { get; set; }
    public int      CustomerID   { get; set; }
    public string?  CustomerName { get; set; }   // populated via JOIN
    public string   OrderType    { get; set; } = string.Empty;   // Stock | Custom
    public string   OrderStatus  { get; set; } = "Pending";
    public DateTime OrderDate    { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string?  ShippingAddr { get; set; }
    public decimal  TotalAmount  { get; set; }
    public decimal  Discount     { get; set; }
    public decimal  FinalAmount  { get; set; }   // computed in DB
    public string?  Notes        { get; set; }
    public int?     CreatedBy    { get; set; }
    public DateTime CreatedAt    { get; set; }
    public DateTime UpdatedAt    { get; set; }
 
    // Navigation
    public List<OrderItem>?    Items      { get; set; }
    public CustomOrderSpec?    CustomSpec { get; set; }
}