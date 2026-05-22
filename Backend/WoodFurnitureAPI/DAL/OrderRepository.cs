using Microsoft.Data.SqlClient;
using System.Data;
public class OrderRepository : BaseRepository
{
    public OrderRepository(string connectionString) : base(connectionString) { }
 
    public List<Order> GetAll()
    {
        var list = new List<Order>();
        using var conn = GetConnection();
        conn.Open();
     using var cmd = new SqlCommand(@"
            SELECT v.*, o.CustomerID, 
            COALESCE(c.FirstName + ' ' + c.LastName, c.FirstName, c.CompanyName, u.Username) AS FinalCustomerName
            FROM vw_AllOrders v
            LEFT JOIN dbo.Orders o ON v.OrderID = o.OrderID
            LEFT JOIN dbo.Customers c ON o.CustomerID = c.CustomerID
            LEFT JOIN dbo.Users u ON c.UserID = u.UserID
            ORDER BY v.OrderDate DESC", conn);
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapOrder(reader));
 
        return list;
    }
 
    public Order? GetByID(int id)
    {
        using var conn = GetConnection();
        conn.Open();
      using var cmd = new SqlCommand(@"
            SELECT v.*, o.CustomerID, 
            COALESCE(c.FirstName + ' ' + c.LastName, c.FirstName, c.CompanyName, u.Username) AS FinalCustomerName
            FROM vw_AllOrders v
            LEFT JOIN dbo.Orders o ON v.OrderID = o.OrderID
            LEFT JOIN dbo.Customers c ON o.CustomerID = c.CustomerID
            LEFT JOIN dbo.Users u ON c.UserID = u.UserID
            WHERE v.OrderID = @ID", conn);
             cmd.Parameters.AddWithValue("@ID", id);
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapOrder(reader) : null;
    }
 
    // Calls sp_PlaceStockOrder stored procedure
    public int PlaceStockOrder(PlaceStockOrderDto dto, int createdBy)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_PlaceStockOrder", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@CustomerID",   dto.CustomerID);
        cmd.Parameters.AddWithValue("@ProductID",    dto.ProductID);
        cmd.Parameters.AddWithValue("@Quantity",     dto.Quantity);
        cmd.Parameters.AddWithValue("@UnitPrice",    dto.UnitPrice);
        cmd.Parameters.AddWithValue("@Discount",     dto.Discount);
        cmd.Parameters.AddWithValue("@ShippingAddr", (object?)dto.ShippingAddr ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CreatedBy",    createdBy);
 
        using var reader = cmd.ExecuteReader();
        reader.Read();
        return (int)reader["NewOrderID"];
    }
 
    // Calls sp_PlaceCustomOrder stored procedure
    public int PlaceCustomOrder(PlaceCustomOrderDto dto, int createdBy)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_PlaceCustomOrder", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@CustomerID",    dto.CustomerID);
        cmd.Parameters.AddWithValue("@Discount",      dto.Discount);
        cmd.Parameters.AddWithValue("@ShippingAddr",  (object?)dto.ShippingAddr ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CreatedBy",     createdBy);
        cmd.Parameters.AddWithValue("@FurnitureType", dto.FurnitureType);
        cmd.Parameters.AddWithValue("@WoodType",      (object?)dto.WoodType     ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Finish",        (object?)dto.Finish       ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Dimensions",    (object?)dto.Dimensions   ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@SpecialNotes",  (object?)dto.SpecialNotes ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@QuotedPrice",   dto.QuotedPrice);
 
        using var reader = cmd.ExecuteReader();
        reader.Read();
        return (int)reader["NewOrderID"];
    }
 
    // Calls sp_UpdateOrderStatus stored procedure
    public void UpdateStatus(int orderId, string newStatus, int updatedBy)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_UpdateOrderStatus", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@OrderID",   orderId);
        cmd.Parameters.AddWithValue("@NewStatus", newStatus);
        cmd.Parameters.AddWithValue("@UpdatedBy", updatedBy);
 
        cmd.ExecuteNonQuery();
    }
 
public int? GetCustomerIdByUserId(int userId)
{
    using var conn = GetConnection();
    conn.Open();
    using var cmd = new SqlCommand("SELECT CustomerID FROM dbo.Customers WHERE UserID = @UserID", conn);
    cmd.Parameters.AddWithValue("@UserID", userId);
    
    var result = cmd.ExecuteScalar();
    
    if (result != null && result != DBNull.Value)
    {
        return Convert.ToInt32(result); // We found their true Customer ID!
    }
    
    return null; // This User hasn't created a Customer profile yet
}
    private Order MapOrder(SqlDataReader r) => new Order
    {
        OrderID      = (int)r["OrderID"],
        CustomerID   = (int)r["CustomerID"],CustomerName = r["FinalCustomerName"] == DBNull.Value ? null : r["FinalCustomerName"].ToString(),
        OrderType    = r["OrderType"].ToString()!,
        OrderStatus  = r["OrderStatus"].ToString()!,
        OrderDate    = (DateTime)r["OrderDate"],
        DeliveryDate = r["DeliveryDate"] == DBNull.Value ? null : (DateTime)r["DeliveryDate"],
        ShippingAddr = r["ShippingAddr"] == DBNull.Value ? null : r["ShippingAddr"].ToString(),
        TotalAmount  = (decimal)r["TotalAmount"],
        Discount     = (decimal)r["Discount"],
        FinalAmount  = (decimal)r["FinalAmount"],
        Notes        = r["Notes"]        == DBNull.Value ? null : r["Notes"].ToString()
        // CreatedAt    = (DateTime)r["CreatedAt"],
        // UpdatedAt    = (DateTime)r["UpdatedAt"]
    };
}
 