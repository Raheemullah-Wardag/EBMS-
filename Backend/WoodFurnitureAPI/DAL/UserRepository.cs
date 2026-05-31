 using Microsoft.Data.SqlClient;
using System.Data;
// ============================================================
//  UserRepository.cs
// ============================================================
public class UserRepository : BaseRepository
{
    public UserRepository(string connectionString) : base(connectionString) { }
 
    // Used by AuthService — calls sp_Login stored procedure
    public User? GetByUsername(string username)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_Login", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@Username", username);
 
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new User
            {
                UserID       = (int)reader["UserID"],
                Username     = reader["Username"].ToString()!,
                Email        = reader["Email"].ToString()!,
                PasswordHash = reader["PasswordHash"].ToString()!,
                RoleName     = reader["RoleName"].ToString()
            };
        }
        return null;
    }
 
    // Used by AuthService — register new user
    public int Create(User user)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            INSERT INTO Users (Username, Email, PasswordHash, RoleID)
            VALUES (@Username, @Email, @PasswordHash, @RoleID);
            SELECT SCOPE_IDENTITY();", conn);
 
        cmd.Parameters.AddWithValue("@Username",     user.Username);
        cmd.Parameters.AddWithValue("@Email",        user.Email);
        cmd.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
        cmd.Parameters.AddWithValue("@RoleID",       user.RoleID);
 
        return Convert.ToInt32(cmd.ExecuteScalar());
    }

    // Get all users for admin management
    public List<User> GetAll()
    {
        var list = new List<User>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT U.UserID, U.Username, U.Email, R.RoleName
            FROM Users U
            JOIN Roles R ON U.RoleID = R.RoleID
            ORDER BY U.Username", conn);

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(new User
            {
                UserID = (int)reader["UserID"],
                Username = reader["Username"].ToString()!,
                Email = reader["Email"].ToString()!,
                RoleName = reader["RoleName"].ToString()!
            });

        return list;
    }

    // Check if username or email exists
public User? GetByID(int id)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT UserID, Username, Email, PasswordHash, RoleID
            FROM Users WHERE UserID = @UserID", conn);
        cmd.Parameters.AddWithValue("@UserID", id);
 
        using var reader = cmd.ExecuteReader();
        if (reader.Read())
        {
            return new User
            {
                UserID       = (int)reader["UserID"],
                Username     = reader["Username"].ToString()!,
                Email        = reader["Email"].ToString()!,
                PasswordHash = reader["PasswordHash"].ToString()!,
                RoleID       = (int)reader["RoleID"]
            };
        }
        return null;
    }
 
    public void Update(User user)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            UPDATE Users SET
                Username = @Username,
                Email = @Email,
                PasswordHash = @PasswordHash
            WHERE UserID = @UserID", conn);
 
        cmd.Parameters.AddWithValue("@Username", user.Username);
        cmd.Parameters.AddWithValue("@Email", user.Email);
        cmd.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
        cmd.Parameters.AddWithValue("@UserID", user.UserID);
        cmd.ExecuteNonQuery();
    }
 
    public bool Exists(string username, string email)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT COUNT(*) FROM Users WHERE Username = @Username OR Email = @Email", conn);
        cmd.Parameters.AddWithValue("@Username", username);
        cmd.Parameters.AddWithValue("@Email", email);

        return (int)cmd.ExecuteScalar() > 0;
    }
}
