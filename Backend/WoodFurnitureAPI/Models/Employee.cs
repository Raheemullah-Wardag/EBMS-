// ============================================================
//  Employee.cs
// ============================================================
public class Employee
{
    public int      EmployeeID  { get; set; }
    public int?     UserID      { get; set; }
    public string   FirstName   { get; set; } = string.Empty;
    public string   LastName    { get; set; } = string.Empty;
    public string   FullName    => $"{FirstName} {LastName}";
    public string?  NationalID  { get; set; }
    public string?  Phone       { get; set; }
    public string?  JobTitle    { get; set; }
    public string?  Department  { get; set; }
    public DateTime HireDate    { get; set; }
    public decimal  Salary      { get; set; }
    public bool     IsActive    { get; set; } = true;
    public string?  Username    { get; set; }
    public string?  Email       { get; set; }
    public string?  RoleName    { get; set; }
    public DateTime CreatedAt   { get; set; }
}
 