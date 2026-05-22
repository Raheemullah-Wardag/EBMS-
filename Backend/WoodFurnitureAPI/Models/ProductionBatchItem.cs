// ProductionBatchItem.cs
public class ProductionBatchItem
{
    public int     BatchItemID      { get; set; }
    public int     BatchID          { get; set; }
    public int?    ProductID        { get; set; }
    public string? ProductName      { get; set; }  // populated via JOIN
    public int?    SpecID           { get; set; }
    public string? FurnitureType    { get; set; }  // populated via JOIN from CustomOrderSpecs
    public int     QuantityPlanned  { get; set; }
    public int     QuantityMade     { get; set; }

    // Helper
    public int RemainingQty => QuantityPlanned - QuantityMade;
}