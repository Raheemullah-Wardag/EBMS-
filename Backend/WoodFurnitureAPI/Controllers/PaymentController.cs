using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ManagerUp")]
public class PaymentController : ControllerBase
{
    private readonly PaymentService _paymentService;
 
    public PaymentController(PaymentService paymentService)
    {
        _paymentService = paymentService;
    }
 
    // GET /api/payments/order/5
    [HttpGet("order/{orderId}")]
    public IActionResult GetByOrderID(int orderId)
    {
        var payments = _paymentService.GetByOrderID(orderId);
        return Ok(payments);
    }
 
    // POST /api/payments
    [HttpPost]
    public IActionResult ProcessPayment([FromBody] ProcessPaymentDto dto)
    {
        _paymentService.ProcessPayment(dto);
        return Ok(new { message = "Payment processed." });
    }
}
 