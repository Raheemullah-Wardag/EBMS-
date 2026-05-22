using Microsoft.Data.SqlClient;
using System.Data;
public class PaymentRepository : BaseRepository
{
    public PaymentRepository(string connectionString) : base(connectionString) { }
 
    public List<Payment> GetByOrderID(int orderId)
    {
        var list = new List<Payment>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM Payments WHERE OrderID = @OrderID ORDER BY CreatedAt DESC", conn);
        cmd.Parameters.AddWithValue("@OrderID", orderId);
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapPayment(reader));
 
        return list;
    }
 
    // Calls sp_ProcessPayment stored procedure
    public void ProcessPayment(ProcessPaymentDto dto)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_ProcessPayment", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@OrderID",        dto.OrderID);
        cmd.Parameters.AddWithValue("@Amount",         dto.Amount);
        cmd.Parameters.AddWithValue("@PaymentMethod",  dto.PaymentMethod);
        cmd.Parameters.AddWithValue("@TransactionRef", (object?)dto.TransactionRef ?? DBNull.Value);
 
        cmd.ExecuteNonQuery();
    }
 
    private Payment MapPayment(SqlDataReader r) => new Payment
    {
        PaymentID      = (int)r["PaymentID"],
        OrderID        = (int)r["OrderID"],
        Amount         = (decimal)r["Amount"],
        PaymentMethod  = r["PaymentMethod"].ToString()!,
        PaymentStatus  = r["PaymentStatus"].ToString()!,
        TransactionRef = r["TransactionRef"] == DBNull.Value ? null : r["TransactionRef"].ToString(),
        PaidAt         = r["PaidAt"]         == DBNull.Value ? null : (DateTime?)r["PaidAt"],
        CreatedAt      = (DateTime)r["CreatedAt"]
    };
}