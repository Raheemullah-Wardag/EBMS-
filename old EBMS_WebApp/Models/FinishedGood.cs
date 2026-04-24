using System;

namespace EBMS_WebApp.Models
{
    public class FinishedGood
    {
        public int FG_ID { get; set; }
        public string ProductName { get; set; }
        public decimal SellingPrice { get; set; }

        // ENCAPSULATION: The stock quantity is PRIVATE. 
        // The outside world cannot say "StockQuantity = -500".
        private int _stockQuantity;

        // Public read-only property so the UI can see the stock, but can't change it.
        public int CurrentStock
        {
            get { return _stockQuantity; }
        }

        // Public method to safely ADD stock (Production)
        public void ProduceStock(int quantity)
        {
            if (quantity > 0)
            {
                _stockQuantity += quantity;
            }
        }

        // Public method to safely REMOVE stock (Sales/Dispatch)
        public bool DispatchStock(int quantity)
        {
            if (quantity > 0 && quantity <= _stockQuantity)
            {
                _stockQuantity -= quantity;
                return true; // Dispatch successful
            }
            return false; // Not enough stock!
        }
    }
}