namespace EBMS_WebApp.Models
{
    public abstract class Employee
    {
        public int EmpID { get; set; }
        public string Name { get; set; }
        public int DeptID { get; set; }

        // POLYMORPHISM: Every employee gets paid differently
        public abstract decimal CalculateSalary();
    }
}