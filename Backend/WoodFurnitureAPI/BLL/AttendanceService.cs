public class AttendanceService
{
    private readonly AttendanceRepository _repo;
 
    public AttendanceService(AttendanceRepository repo)
    {
        _repo = repo;
    }
 
    public List<AttendanceResponseDto> GetAll()
    {
        return _repo.GetAll().Select(MapToDto).ToList();
    }
 
    public List<AttendanceResponseDto> GetByEmployee(int employeeId)
    {
        return _repo.GetByEmployee(employeeId).Select(MapToDto).ToList();
    }
 
    public void MarkAttendance(MarkAttendanceDto dto)
    {
        _repo.MarkAttendance(dto);
    }
 
    private AttendanceResponseDto MapToDto(Attendance a) => new AttendanceResponseDto
    {
        AttendanceID = a.AttendanceID,
        EmployeeID   = a.EmployeeID,
        EmployeeName = a.EmployeeName,
        WorkDate     = a.WorkDate,
        CheckIn      = a.CheckIn?.ToString(),
        CheckOut     = a.CheckOut?.ToString(),
        Status       = a.Status,
        Notes        = a.Notes
    };
}
 