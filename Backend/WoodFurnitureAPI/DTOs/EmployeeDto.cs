
// ============================================================
//  EMPLOYEE DTOs
//  File : DTOs/EmployeeDto.cs
// ============================================================
 
public class EmployeeResponseDto
{
    public int      EmployeeID  { get; set; }
    public string   FullName    { get; set; } = string.Empty;
    public string?  JobTitle    { get; set; }
    public string?  Department  { get; set; }
    public string?  Phone       { get; set; }
    public DateTime HireDate    { get; set; }
    public decimal  Salary      { get; set; }
    public bool     IsActive    { get; set; }
    public string?  Username    { get; set; }
    public string?  Email       { get; set; }
    public string?  RoleName    { get; set; }
}
 
public class EmployeeCreateDto
{
    // --- Employee Details ---
    public string   FirstName  { get; set; } = string.Empty;
    public string   LastName   { get; set; } = string.Empty;
    public string?  NationalID { get; set; }
    public string?  Phone      { get; set; }
    public string?  JobTitle   { get; set; }
    public string?  Department { get; set; }
    public DateTime HireDate   { get; set; }
    public decimal  Salary     { get; set; }

    // --- Account Details (NEW) ---
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; 
}