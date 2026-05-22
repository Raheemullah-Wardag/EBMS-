 
public class AttendanceResponseDto
{
    public int      AttendanceID  { get; set; }
    public int      EmployeeID    { get; set; }
    public string?  EmployeeName  { get; set; }
    public string?  Department    { get; set; }
    public DateTime WorkDate      { get; set; }
    public string?  CheckIn       { get; set; }
    public string?  CheckOut      { get; set; }
    public string   Status        { get; set; } = string.Empty;
    public string?  Notes         { get; set; }
}
 
public class MarkAttendanceDto
{
    public int      EmployeeID { get; set; }
    public DateTime WorkDate   { get; set; }
    public string?  CheckIn    { get; set; }
    public string?  CheckOut   { get; set; }
    public string   Status     { get; set; } = "Present";
    public string?  Notes      { get; set; }
}