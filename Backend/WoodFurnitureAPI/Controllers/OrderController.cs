using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
 
    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }
 
    // GET /api/orders
    [HttpGet]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult GetAll()
    {
        var orders = _orderService.GetAll();
        return Ok(orders);
    }
 
    // GET /api/orders/5
    [HttpGet("{id}")]
    [Authorize(Policy = "EmployeeUp")]
    public IActionResult GetByID(int id)
    {
        var order = _orderService.GetByID(id);
        if (order == null)
            return NotFound(new { message = "Order not found." });
 
        return Ok(order);
    }
    // GET /api/orders/my
    [HttpGet("my")]
    [Authorize] // <- Standard login required, NO manager policy needed
    public IActionResult GetMyOrders()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        int loggedInUserId = int.Parse(userIdClaim);
        int? actualCustomerId = _orderService.GetCustomerIdByUserId(loggedInUserId);

        // If they haven't completed their customer profile, return an empty list
        if (actualCustomerId == null || actualCustomerId == 0) 
            return Ok(new List<OrderResponseDto>()); 

        // Filter the orders down to ONLY this customer's orders
        var myOrders = _orderService.GetAll().Where(o => o.CustomerID == actualCustomerId).ToList();
        return Ok(myOrders);
    }
 
    // POST /api/orders/stock
    [HttpPost("stock")]
    [Authorize] // ← Requires login
    public IActionResult PlaceStockOrder([FromBody] PlaceStockOrderDto dto)
    {
        // 1. Get logged-in USER ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "Invalid token or user not found." });
        }

        int loggedInUserId = int.Parse(userIdClaim);

        // 2. LOOK UP the true Customer ID associated with this User ID
        int? actualCustomerId = _orderService.GetCustomerIdByUserId(loggedInUserId);

        // If this User hasn't created a customer profile yet, stop them nicely
        if (actualCustomerId == null || actualCustomerId == 0)
        {
            return BadRequest(new { message = "You must complete your Customer Profile before placing an order." });
        }

        // 3. Assign the TRUE Customer ID to the DTO
        dto.CustomerID = actualCustomerId.Value; 

        // 4. Pass to service (passing the logged in User ID as 'createdBy')
        var newId = _orderService.PlaceStockOrder(dto, loggedInUserId);
        return Ok(new { message = "Stock order placed.", orderId = newId });
    }
 
    // POST /api/orders/custom
    [HttpPost("custom")]
    [Authorize] // ← Requires login
    public IActionResult PlaceCustomOrder([FromBody] PlaceCustomOrderDto dto)
    {
        // 1. Get logged-in USER ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "Invalid token or user not found." });
        }

        int loggedInUserId = int.Parse(userIdClaim);
       
        // Console log just for you to verify during testing
        Console.WriteLine($"\n\n ---> THE TOKEN EXTRACTED USER ID IS: {loggedInUserId} <--- \n\n");

        // 2. LOOK UP the true Customer ID associated with this User ID
        int? actualCustomerId = _orderService.GetCustomerIdByUserId(loggedInUserId);

        if (actualCustomerId == null || actualCustomerId == 0)
        {
            return BadRequest(new { message = "You must complete your Customer Profile before placing an order." });
        }

        // Console log just for you to verify during testing
        Console.WriteLine($"\n\n ---> THE FOUND DATABASE CUSTOMER ID IS: {actualCustomerId.Value} <--- \n\n");

        // 3. Assign the TRUE Customer ID to the DTO
        dto.CustomerID = actualCustomerId.Value;

        // 4. Pass to service
        var newId = _orderService.PlaceCustomOrder(dto, loggedInUserId);
        return Ok(new { message = "Custom order placed.", orderId = newId });
    }
 
    // PUT /api/orders/5/status
    [HttpPut("{id}/status")]
    [Authorize(Policy = "ManagerUp")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int updatedBy   = userIdClaim != null ? int.Parse(userIdClaim) : 0;
 
        var success = _orderService.UpdateStatus(id, dto, updatedBy);
        if (!success)
            return NotFound(new { message = "Order not found." });
 
        return Ok(new { message = "Order status updated." });
    }
}