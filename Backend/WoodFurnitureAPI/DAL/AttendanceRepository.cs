using Microsoft.Data.SqlClient;
using System.Data;
public class AttendanceRepository : BaseRepository
{
    public AttendanceRepository(string connectionString) : base(connectionString) { }
 
    public List<Attendance> GetAll()
    {
        var list = new List<Attendance>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_AttendanceSummary ORDER BY WorkDate DESC", conn);
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapAttendance(reader));
 
        return list;
    }
 
    public List<Attendance> GetByEmployee(int employeeId)
    {
        var list = new List<Attendance>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_AttendanceSummary 
            WHERE EmployeeID = @ID ORDER BY WorkDate DESC", conn);
        cmd.Parameters.AddWithValue("@ID", employeeId);
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapAttendance(reader));
 
        return list;
    }
 
    // Calls sp_MarkAttendance stored procedure
    public void MarkAttendance(MarkAttendanceDto dto)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_MarkAttendance", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@EmployeeID", dto.EmployeeID);
        cmd.Parameters.AddWithValue("@WorkDate",   dto.WorkDate);
        cmd.Parameters.AddWithValue("@CheckIn",    (object?)dto.CheckIn  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@CheckOut",   (object?)dto.CheckOut ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Status",     dto.Status);
        cmd.Parameters.AddWithValue("@Notes",      (object?)dto.Notes    ?? DBNull.Value);
 
        cmd.ExecuteNonQuery();
    }
 
    private Attendance MapAttendance(SqlDataReader r) => new Attendance
    {
        AttendanceID = (int)r["AttendanceID"],
        EmployeeID   = (int)r["EmployeeID"],
        EmployeeName = r["EmployeeName"] == DBNull.Value ? null : r["EmployeeName"].ToString(),
        WorkDate     = (DateTime)r["WorkDate"],
        CheckIn      = r["CheckIn"]  == DBNull.Value ? null : (TimeSpan?)r["CheckIn"],
        CheckOut     = r["CheckOut"] == DBNull.Value ? null : (TimeSpan?)r["CheckOut"],
        Status       = r["Status"].ToString()!,
        Notes        = r["Notes"] == DBNull.Value ? null : r["Notes"].ToString()
    };
}
 