namespace EBMS_WebApp.Models
{
	// 1. ABSTRACTION: We use 'abstract' so you can't create a generic "BusinessEntity"
	// You must create a specific Client or Supplier.
	public abstract class BusinessEntity
	{
		public int ID { get; set; }
		public string Name { get; set; }
		public string ContactPhone { get; set; }

		// 2. POLYMORPHISM: Abstract method that children MUST implement differently
		public abstract string GetDetails();
	}
}