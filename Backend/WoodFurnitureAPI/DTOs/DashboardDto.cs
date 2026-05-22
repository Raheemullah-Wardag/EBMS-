 
public class DashboardStatsDto
{
    public int     TotalOrders        { get; set; }
    public int     PendingOrders      { get; set; }
    public int     InProductionOrders { get; set; }
    public int     DeliveredOrders    { get; set; }
    public decimal TotalRevenue       { get; set; }
    public int     TotalProducts      { get; set; }
    public int     LowStockProducts   { get; set; }
    public int     TotalEmployees     { get; set; }
    public int     TotalCustomers     { get; set; }
    public int     ActiveBatches      { get; set; }
}