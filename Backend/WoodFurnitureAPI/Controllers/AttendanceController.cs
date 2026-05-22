
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "EmployeeUp")]
public class AttendanceController : ControllerBase
{
    private readonly AttendanceService _attendanceService;
 
    public AttendanceController(AttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }
 
    // GET /api/attendance
    [HttpGet]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult GetAll()
    {
        var records = _attendanceService.GetAll();
        return Ok(records);
    }
 
    // GET /api/attendance/employee/5
    [HttpGet("employee/{employeeId}")]
    public IActionResult GetByEmployee(int employeeId)
    {
        var records = _attendanceService.GetByEmployee(employeeId);
        return Ok(records);
    }
 
    // POST /api/attendance
    [HttpPost]
    public IActionResult MarkAttendance([FromBody] MarkAttendanceDto dto)
    {
        _attendanceService.MarkAttendance(dto);
        return Ok(new { message = "Attendance marked." });
    }
}
 