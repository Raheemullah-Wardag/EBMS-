using EBMS_WebApp.Models;
using System.Data;

namespace EBMS_WebApp.DataAccess
{
    public class HRDataAccess
    {
        private readonly DBHelper _db;

        public HRDataAccess(DBHelper db)
        {
            _db = db;
        }

        public List<Employee> GetAllEmployees()
        {
            List<Employee> list = new List<Employee>();
            string query = "SELECT EmpID, Name, EmpType, DeptID FROM EMPLOYEE";
            DataTable dt = _db.ExecuteQuery(query);

            foreach (DataRow row in dt.Rows)
            {
                string empType = row["EmpType"].ToString();
                Employee emp;

                // POLYMORPHISM!
                if (empType == "Intern") { emp = new Intern(); }
                else { emp = new PermanentEmployee(); }

                emp.EmpID = Convert.ToInt32(row["EmpID"]);
                emp.Name = row["Name"].ToString();
                emp.DeptID = row["DeptID"] == DBNull.Value ? 0 : Convert.ToInt32(row["DeptID"]);

                list.Add(emp);
            }
            return list;
        }
    }
}