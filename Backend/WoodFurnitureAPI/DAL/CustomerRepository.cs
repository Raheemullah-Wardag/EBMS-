using Microsoft.Data.SqlClient;
using System.Data;
public class CustomerRepository : BaseRepository
{
    public CustomerRepository(string connectionString) : base(connectionString) { }
 
    public List<Customer> GetAll()
    {
        var list = new List<Customer>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM Customers WHERE IsActive = 1 ORDER BY CreatedAt DESC", conn);
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapCustomer(reader));
 
        return list;
    }
 
    public Customer? GetByID(int id)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("SELECT * FROM Customers WHERE CustomerID = @ID", conn);
        cmd.Parameters.AddWithValue("@ID", id);
 
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapCustomer(reader) : null;
    }
 
    public int Create(Customer c)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            INSERT INTO Customers 
                (UserID, CustomerType, FirstName, LastName, CompanyName, Email, Phone, Address, City, Country)
            VALUES 
                (@UserID, @CustomerType, @FirstName, @LastName, @CompanyName, @Email, @Phone, @Address, @City, @Country);
            SELECT SCOPE_IDENTITY();", conn);
 
        cmd.Parameters.AddWithValue("@UserID",       (object?)c.UserID      ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CustomerType", c.CustomerType);
        cmd.Parameters.AddWithValue("@FirstName",    (object?)c.FirstName   ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@LastName",     (object?)c.LastName    ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CompanyName",  (object?)c.CompanyName ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Email",        c.Email);
        cmd.Parameters.AddWithValue("@Phone",        (object?)c.Phone       ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Address",      (object?)c.Address     ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@City",         (object?)c.City        ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Country",      c.Country);
 
        return Convert.ToInt32(cmd.ExecuteScalar());
    }
 
    private Customer MapCustomer(SqlDataReader r) => new Customer
    {
        CustomerID   = (int)r["CustomerID"],
        UserID       = r["UserID"]      == DBNull.Value ? null : (int)r["UserID"],
        CustomerType = r["CustomerType"].ToString()!,
        FirstName    = r["FirstName"]   == DBNull.Value ? null : r["FirstName"].ToString(),
        LastName     = r["LastName"]    == DBNull.Value ? null : r["LastName"].ToString(),
        CompanyName  = r["CompanyName"] == DBNull.Value ? null : r["CompanyName"].ToString(),
        Email        = r["Email"].ToString()!,
        Phone        = r["Phone"]       == DBNull.Value ? null : r["Phone"].ToString(),
        Address      = r["Address"]     == DBNull.Value ? null : r["Address"].ToString(),
        City         = r["City"]        == DBNull.Value ? null : r["City"].ToString(),
        Country      = r["Country"].ToString()!,
        IsActive     = (bool)r["IsActive"],
        CreatedAt    = (DateTime)r["CreatedAt"]
    };
}
 
