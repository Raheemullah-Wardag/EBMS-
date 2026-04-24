//using Microsoft.Data.SqlClient;
//using System.Data;

//namespace EBMS_WebApp.DataAccess
//{
//    public class DBHelper
//    {
//        private readonly string _connString;

//        public DBHelper(IConfiguration config)
//        {
//            _connString = config.GetConnectionString("DefaultConnection");
//        }

//        public DataTable ExecuteQuery(string query)
//        {
//            DataTable dt = new DataTable();
//            using (SqlConnection conn = new SqlConnection(_connString))
//            {
//                using (SqlCommand cmd = new SqlCommand(query, conn))
//                {
//                    conn.Open();
//                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
//                    {
//                        da.Fill(dt);
//                    }
//                }
//            }
//            return dt;
//        }
//    }
//}
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration; // <-- Add this!

namespace EBMS_WebApp.DataAccess
{
    public class DBHelper
    {
        private readonly string _connString;

        public DBHelper(IConfiguration config)
        {
            // Use ?? "" to handle potential null warnings in newer .NET versions
            _connString = config.GetConnectionString("DefaultConnection") ?? "";
        }

        public DataTable ExecuteQuery(string query)
        {
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(_connString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    try
                    {
                        conn.Open();
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                    }
                    catch (Exception ex)
                    {
                        // For now, rethrow the error so you can see it while building
                        throw new Exception("Database Error: " + ex.Message);
                    }
                }
            }
            return dt;
        }
    }
}