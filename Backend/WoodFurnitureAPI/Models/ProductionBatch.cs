// ============================================================
//  ProductionBatch.cs
// ============================================================
public class ProductionBatch
{
    public int      BatchID    { get; set; }
    public int?     OrderID    { get; set; }
    public string   BatchName  { get; set; } = string.Empty;
    public string   Status     { get; set; } = "Planned";
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate   { get; set; }
    public int?     AssignedTo { get; set; }
    public string?  AssignedToName { get; set; }   // populated via JOIN
    public string?  Notes      { get; set; }
    public DateTime CreatedAt  { get; set; }
    public DateTime UpdatedAt  { get; set; }
}