 
// ============================================================
//  BaseRepository.cs
//  Shared DB connection helper — all repos inherit from this
// ============================================================
using Microsoft.Data.SqlClient;
 
public class BaseRepository
{
    protected readonly string _connectionString;
 
    public BaseRepository(string connectionString)
    {
        _connectionString = connectionString;
    }
 
    // Creates and opens a new SQL connection
    protected SqlConnection GetConnection()
    {
        return new SqlConnection(_connectionString);
    }
}