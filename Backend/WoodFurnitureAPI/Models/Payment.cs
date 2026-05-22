 
// ============================================================
//  Payment.cs
// ============================================================
public class Payment
{
    public int      PaymentID      { get; set; }
    public int      OrderID        { get; set; }
    public decimal  Amount         { get; set; }
    public string   PaymentMethod  { get; set; } = string.Empty;  // Cash | BankTransfer | Card | Cheque
    public string   PaymentStatus  { get; set; } = "Pending";
    public string?  TransactionRef { get; set; }
    public DateTime? PaidAt        { get; set; }
    public DateTime CreatedAt      { get; set; }
}
