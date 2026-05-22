
// Sent to React — order list / detail
public class OrderResponseDto
{
    public int      OrderID      { get; set; }
    public string   OrderType    { get; set; } = string.Empty;
    public string   OrderStatus  { get; set; } = string.Empty;
    public DateTime OrderDate    { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string?  CustomerName { get; set; }
    public string?  CustomerEmail { get; set; }
    public int      CustomerID   { get; set; }
    public decimal  TotalAmount  { get; set; }
    public decimal  Discount     { get; set; }
    public decimal  FinalAmount  { get; set; }
    public string?  ShippingAddr { get; set; }
    public string?  Notes        { get; set; }
 
    // Line items (Stock orders)
    public List<OrderItemResponseDto>? Items { get; set; }
 
    // Custom spec (Custom orders)
    public CustomOrderSpecResponseDto? CustomSpec { get; set; }
}
 
// Received from React — place stock order
public class PlaceStockOrderDto
{
    public int     CustomerID   { get; set; }
    public int     ProductID    { get; set; }
    public int     Quantity     { get; set; }
    public decimal UnitPrice    { get; set; }
    public decimal Discount     { get; set; }
    public string? ShippingAddr { get; set; }
}
 
// Received from React — place custom order
public class PlaceCustomOrderDto
{
    public int     CustomerID    { get; set; }
    public decimal Discount      { get; set; }
    public string? ShippingAddr  { get; set; }
    public string  FurnitureType { get; set; } = string.Empty;
    public string? WoodType      { get; set; }
    public string? Finish        { get; set; }
    public string? Dimensions    { get; set; }
    public string? SpecialNotes  { get; set; }
    public decimal QuotedPrice   { get; set; }
}
 
// Received from React — update order status
public class UpdateOrderStatusDto
{
    public string NewStatus { get; set; } = string.Empty;
}
 
 
// ============================================================
//  ORDER ITEM DTO
//  File : DTOs/OrderDto.cs  (same file)
// ============================================================
 
public class OrderItemResponseDto
{
    public int     OrderItemID  { get; set; }
    public string? ProductName  { get; set; }
    public string? SKU          { get; set; }
    public int     Quantity     { get; set; }
    public decimal UnitPrice    { get; set; }
    public decimal LineTotal    { get; set; }
}
 
 
// ============================================================
//  CUSTOM ORDER SPEC DTO
//  File : DTOs/OrderDto.cs  (same file)
// ============================================================
 
public class CustomOrderSpecResponseDto
{
    public int      SpecID        { get; set; }
    public string   FurnitureType { get; set; } = string.Empty;
    public string?  WoodType      { get; set; }
    public string?  Finish        { get; set; }
    public string?  Dimensions    { get; set; }
    public string?  SpecialNotes  { get; set; }
    public decimal? QuotedPrice   { get; set; }
    public string?  ApprovedBy    { get; set; }
}
 