namespace EBMS_WebApp.Models
{
    // 3. INHERITANCE: Client inherits ID, Name, and Phone from BusinessEntity
    public class Client : BusinessEntity
    {
        public string OutletAddress { get; set; }

        // POLYMORPHISM: Implementing the specific behavior for a Client
        public override string GetDetails()
        {
            return $"Client: {Name} | Outlet: {OutletAddress} | Contact: {ContactPhone}";
        }
    }
}