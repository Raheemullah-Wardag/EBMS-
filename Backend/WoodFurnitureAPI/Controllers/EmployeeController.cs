
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "EmployeeUp")]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeService _employeeService;
 
    public EmployeeController(EmployeeService employeeService)
    {
        _employeeService = employeeService;
    }
 
    // GET /api/employees
    [HttpGet]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult GetAll()
    {
        var employees = _employeeService.GetAll();
        return Ok(employees);
    }
 
    // GET /api/employees/5
    [HttpGet("{id}")]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult GetByID(int id)
    {
        var emp = _employeeService.GetByID(id);
        if (emp == null)
            return NotFound(new { message = "Employee not found." });
 
        return Ok(emp);
    }
 
    // GET /api/employees/user/5
    [HttpGet("user/{userId}")]
    public IActionResult GetByUserID(int userId)
    {
        var emp = _employeeService.GetByUserID(userId);
        if (emp == null)
            return NotFound(new { message = "Employee not found." });
 
        return Ok(emp);
    }
 
    // POST /api/employees
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Create([FromBody] EmployeeCreateDto dto)
    {
        var newId = _employeeService.Create(dto);
        return Ok(new { message = "Employee created.", employeeId = newId });
    }
 
    // PUT /api/employees/5
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Update(int id, [FromBody] EmployeeCreateDto dto)
    {
        var success = _employeeService.Update(id, dto);
        if (!success)
            return NotFound(new { message = "Employee not found." });
 
        return Ok(new { message = "Employee updated." });
    }
}