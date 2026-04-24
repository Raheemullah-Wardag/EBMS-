namespace EBMS_WebApp.Models
{
    public class Intern : Employee
    {
        public decimal FixedStipend { get; set; } = 15000m; // Default stipend

        public override decimal CalculateSalary()
        {
            // Interns just get a flat stipend, no complex math.
            return FixedStipend;
        }
    }
}