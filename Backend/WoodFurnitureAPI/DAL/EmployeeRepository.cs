// using Microsoft.Data.SqlClient;
// using System.Data;
// public class EmployeeRepository : BaseRepository
// {
//     public EmployeeRepository(string connectionString) : base(connectionString) { }
 
//     public List<Employee> GetAll()
//     {
//         var list = new List<Employee>();
//         using var conn = GetConnection();
//         conn.Open();
//         using var cmd = new SqlCommand(@"
//             SELECT * FROM vw_EmployeeDetails ORDER BY FirstName", conn);
 
//         using var reader = cmd.ExecuteReader();
//         while (reader.Read())
//             list.Add(MapEmployee(reader));
 
//         return list;
//     }
 
//     public Employee? GetByID(int id)
//     {
//         using var conn = GetConnection();
//         conn.Open();
//         using var cmd = new SqlCommand(@"
//             SELECT * FROM vw_EmployeeDetails WHERE EmployeeID = @ID", conn);
//         cmd.Parameters.AddWithValue("@ID", id);
 
//         using var reader = cmd.ExecuteReader();
//         return reader.Read() ? MapEmployee(reader) : null;
//     }
 
//     public int Create(Employee e)
//     {
//         using var conn = GetConnection();
//         conn.Open();
//         using var cmd = new SqlCommand(@"
//             INSERT INTO Employees 
//                 (FirstName, LastName, NationalID, Phone, JobTitle, Department, HireDate, Salary)
//             VALUES 
//                 (@FirstName, @LastName, @NationalID, @Phone, @JobTitle, @Department, @HireDate, @Salary);
//             SELECT SCOPE_IDENTITY();", conn);
 
//         cmd.Parameters.AddWithValue("@FirstName",  e.FirstName);
//         cmd.Parameters.AddWithValue("@LastName",   e.LastName);
//         cmd.Parameters.AddWithValue("@NationalID", (object?)e.NationalID  ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@Phone",      (object?)e.Phone       ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@JobTitle",   (object?)e.JobTitle    ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@Department", (object?)e.Department  ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@HireDate",   e.HireDate);
//         cmd.Parameters.AddWithValue("@Salary",     e.Salary);
 
//         return Convert.ToInt32(cmd.ExecuteScalar());
//     }
 
//     public void Update(Employee e)
//     {
//         using var conn = GetConnection();
//         conn.Open();
//         using var cmd = new SqlCommand(@"
//             UPDATE Employees SET
//                 FirstName  = @FirstName,
//                 LastName   = @LastName,
//                 Phone      = @Phone,
//                 JobTitle   = @JobTitle,
//                 Department = @Department,
//                 Salary     = @Salary
//             WHERE EmployeeID = @EmployeeID", conn);
 
//         cmd.Parameters.AddWithValue("@EmployeeID", e.EmployeeID);
//         cmd.Parameters.AddWithValue("@FirstName",  e.FirstName);
//         cmd.Parameters.AddWithValue("@LastName",   e.LastName);
//         cmd.Parameters.AddWithValue("@Phone",      (object?)e.Phone      ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@JobTitle",   (object?)e.JobTitle   ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@Department", (object?)e.Department ?? DBNull.Value);
//         cmd.Parameters.AddWithValue("@Salary",     e.Salary);
 
//         cmd.ExecuteNonQuery();
//     }
 
//     private Employee MapEmployee(SqlDataReader r) => new Employee
//     {
//         EmployeeID = (int)r["EmployeeID"],
//         FirstName  = r["FirstName"].ToString()!,
//         LastName   = r["LastName"].ToString()!,
//         NationalID = r["NationalID"]  == DBNull.Value ? null : r["NationalID"].ToString(),
//         Phone      = r["Phone"]       == DBNull.Value ? null : r["Phone"].ToString(),
//         JobTitle   = r["JobTitle"]    == DBNull.Value ? null : r["JobTitle"].ToString(),
//         Department = r["Department"]  == DBNull.Value ? null : r["Department"].ToString(),
//         HireDate   = (DateTime)r["HireDate"],
//         Salary     = (decimal)r["Salary"],
//         IsActive   = (bool)r["IsActive"],
//         CreatedAt  = (DateTime)r["CreatedAt"]
//     };
// }
using Microsoft.Data.SqlClient;
using System.Data;

public class EmployeeRepository : BaseRepository
{
    public EmployeeRepository(string connectionString) : base(connectionString) { }
 
    public List<Employee> GetAll()
    {
        var list = new List<Employee>();
        using var conn = GetConnection();
        conn.Open();
        
        // FIX 1: Changed ORDER BY to EmployeeID
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_EmployeeDetails ORDER BY EmployeeID", conn); 
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapEmployee(reader));
 
        return list;
    }
 
    public Employee? GetByID(int id)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_EmployeeDetails WHERE EmployeeID = @ID", conn);
        cmd.Parameters.AddWithValue("@ID", id);
 
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapEmployee(reader) : null;
    }
 
    public int Create(Employee e)
    {
        using var conn = GetConnection();
        conn.Open();
        
        // ADDED UserID to the INSERT statement
        using var cmd = new SqlCommand(@"
            INSERT INTO Employees 
                (UserID, FirstName, LastName, NationalID, Phone, JobTitle, Department, HireDate, Salary)
            VALUES 
                (@UserID, @FirstName, @LastName, @NationalID, @Phone, @JobTitle, @Department, @HireDate, @Salary);
            SELECT SCOPE_IDENTITY();", conn);
 
        // Pass the UserID parameter
        cmd.Parameters.AddWithValue("@UserID",     e.UserID);
        
        cmd.Parameters.AddWithValue("@FirstName",  e.FirstName);
        cmd.Parameters.AddWithValue("@LastName",   e.LastName);
        cmd.Parameters.AddWithValue("@NationalID", (object?)e.NationalID  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Phone",      (object?)e.Phone       ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@JobTitle",   (object?)e.JobTitle    ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Department", (object?)e.Department  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@HireDate",   e.HireDate);
        cmd.Parameters.AddWithValue("@Salary",     e.Salary);
 
        return Convert.ToInt32(cmd.ExecuteScalar());
    }
 
    public void Update(Employee e)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            UPDATE Employees SET
                FirstName  = @FirstName,
                LastName   = @LastName,
                Phone      = @Phone,
                JobTitle   = @JobTitle,
                Department = @Department,
                Salary     = @Salary
            WHERE EmployeeID = @EmployeeID", conn);
 
        cmd.Parameters.AddWithValue("@EmployeeID", e.EmployeeID);
        cmd.Parameters.AddWithValue("@FirstName",  e.FirstName);
        cmd.Parameters.AddWithValue("@LastName",   e.LastName);
        cmd.Parameters.AddWithValue("@Phone",      (object?)e.Phone      ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@JobTitle",   (object?)e.JobTitle   ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Department", (object?)e.Department ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Salary",     e.Salary);
 
        cmd.ExecuteNonQuery();
    }
 
    private Employee MapEmployee(SqlDataReader r) => new Employee
    {
        EmployeeID = (int)r["EmployeeID"],
        FirstName  = r["FirstName"].ToString()!,
        LastName   = r["LastName"].ToString()!,
        NationalID = r["NationalID"]  == DBNull.Value ? null : r["NationalID"].ToString(),
        Phone      = r["Phone"]       == DBNull.Value ? null : r["Phone"].ToString(),
        JobTitle   = r["JobTitle"]    == DBNull.Value ? null : r["JobTitle"].ToString(),
        Department = r["Department"]  == DBNull.Value ? null : r["Department"].ToString(),
        HireDate   = (DateTime)r["HireDate"],
        Salary     = (decimal)r["Salary"],
        IsActive   = (bool)r["IsActive"]
        
        // FIX 2: Commented this out because the SQL View "vw_EmployeeDetails" does not return this column!
        // CreatedAt  = (DateTime)r["CreatedAt"] 
    };
}