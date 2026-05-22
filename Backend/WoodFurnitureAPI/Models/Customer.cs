// ============================================================
//  Customer.cs
// ============================================================

public class Customer
{
    public int      CustomerID   { get; set; }
    public int?     UserID       { get; set; }
    public string   CustomerType { get; set; } = "B2C";   // B2B | B2C
    public string?  FirstName    { get; set; }
    public string?  LastName     { get; set; }
    public string?  CompanyName  { get; set; }
    public string   Email        { get; set; } = string.Empty;
    public string?  Phone        { get; set; }
    public string?  Address      { get; set; }
    public string?  City         { get; set; }
    public string   Country      { get; set; } = "Pakistan";
    public bool     IsActive     { get; set; } = true;
    public DateTime CreatedAt    { get; set; }
 
    // Helper — full name or company
    public string DisplayName =>
        CustomerType == "B2B"
            ? CompanyName ?? string.Empty
            : $"{FirstName} {LastName}".Trim();
}