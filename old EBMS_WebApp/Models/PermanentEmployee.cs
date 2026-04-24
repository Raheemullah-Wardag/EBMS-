namespace EBMS_WebApp.Models
{
    public class PermanentEmployee : Employee
    {
        public decimal BaseSalary { get; set; }
        public decimal Bonus { get; set; }
        public int DaysAbsent { get; set; }

        public override decimal CalculateSalary()
        {
            // Abstraction: The UI doesn't know this math, it just calls CalculateSalary()
            decimal deductionPerDay = BaseSalary / 30;
            decimal totalDeduction = deductionPerDay * DaysAbsent;

            return (BaseSalary + Bonus) - totalDeduction;
        }
    }
}