 
public class PaymentResponseDto
{
    public int      PaymentID      { get; set; }
    public int      OrderID        { get; set; }
    public decimal  Amount         { get; set; }
    public string   PaymentMethod  { get; set; } = string.Empty;
    public string   PaymentStatus  { get; set; } = string.Empty;
    public string?  TransactionRef { get; set; }
    public DateTime? PaidAt        { get; set; }
    public string?  CustomerName   { get; set; }
    public decimal  OrderTotal     { get; set; }
}
 
public class ProcessPaymentDto
{
    public int     OrderID        { get; set; }
    public decimal Amount         { get; set; }
    public string  PaymentMethod  { get; set; } = string.Empty;
    public string? TransactionRef { get; set; }
}
 