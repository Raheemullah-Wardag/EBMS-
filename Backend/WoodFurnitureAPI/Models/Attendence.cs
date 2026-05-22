// ============================================================
//  Attendance.cs
// ============================================================

public class Attendance
{
    public int      AttendanceID { get; set; }
    public int      EmployeeID   { get; set; }
    public string?  EmployeeName { get; set; }   // populated via JOIN
    public DateTime WorkDate     { get; set; }
    public TimeSpan? CheckIn     { get; set; }
    public TimeSpan? CheckOut    { get; set; }
    public string   Status       { get; set; } = "Present";  // Present | Absent | Leave | HalfDay
    public string?  Notes        { get; set; }
}
 
