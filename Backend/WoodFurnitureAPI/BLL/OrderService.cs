public class OrderService
{
    private readonly OrderRepository _repo;
 
    public OrderService(OrderRepository repo)
    {
        _repo = repo;
    }
 
    public List<OrderResponseDto> GetAll()
    {
        return _repo.GetAll().Select(MapToDto).ToList();
    }
 
    public OrderResponseDto? GetByID(int id)
    {
        var order = _repo.GetByID(id);
        return order == null ? null : MapToDto(order);
    }
 
    // ---> NEW METHOD ADDED HERE <---
    // This passes the lookup request from the Controller to the Repository
    public int? GetCustomerIdByUserId(int userId)
    {
        return _repo.GetCustomerIdByUserId(userId);
    }
 
    public int PlaceStockOrder(PlaceStockOrderDto dto, int createdBy)
    {
        return _repo.PlaceStockOrder(dto, createdBy);
    }
 
    public int PlaceCustomOrder(PlaceCustomOrderDto dto, int createdBy)
    {
        return _repo.PlaceCustomOrder(dto, createdBy);
    }
 
    public bool UpdateStatus(int orderId, UpdateOrderStatusDto dto, int updatedBy)
    {
        var existing = _repo.GetByID(orderId);
        if (existing == null) return false;
 
        _repo.UpdateStatus(orderId, dto.NewStatus, updatedBy);
        return true;
    }
 
    private OrderResponseDto MapToDto(Order o) => new OrderResponseDto
    {
        OrderID      = o.OrderID,
        OrderType    = o.OrderType,
        OrderStatus  = o.OrderStatus,
        OrderDate    = o.OrderDate,
        DeliveryDate = o.DeliveryDate,
        CustomerID   = o.CustomerID,
        CustomerName = o.CustomerName,
        TotalAmount  = o.TotalAmount,
        Discount     = o.Discount,
        FinalAmount  = o.FinalAmount,
        ShippingAddr = o.ShippingAddr,
        Notes        = o.Notes
    };
}