namespace EBMS_WebApp.Models
{
    // INHERITANCE
    public class Supplier : BusinessEntity
    {
        public string CompanyName { get; set; }

        // POLYMORPHISM: Implementing the specific behavior for a Supplier
        public override string GetDetails()
        {
            return $"Vendor: {CompanyName} (Rep: {Name}) | Contact: {ContactPhone}";
        }
    }
}