public class PaymentService
{
    private readonly PaymentRepository _repo;
 
    public PaymentService(PaymentRepository repo)
    {
        _repo = repo;
    }
 
    public List<PaymentResponseDto> GetByOrderID(int orderId)
    {
        return _repo.GetByOrderID(orderId).Select(MapToDto).ToList();
    }
 
    public void ProcessPayment(ProcessPaymentDto dto)
    {
        _repo.ProcessPayment(dto);
    }
 
    private PaymentResponseDto MapToDto(Payment p) => new PaymentResponseDto
    {
        PaymentID      = p.PaymentID,
        OrderID        = p.OrderID,
        Amount         = p.Amount,
        PaymentMethod  = p.PaymentMethod,
        PaymentStatus  = p.PaymentStatus,
        TransactionRef = p.TransactionRef,
        PaidAt         = p.PaidAt
    };
}
 

