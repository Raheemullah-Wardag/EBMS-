// MaterialUsage.cs
public class MaterialUsage
{
    public int      UsageID    { get; set; }
    public int      BatchID    { get; set; }
    public int      MaterialID { get; set; }
    public string?  MaterialName { get; set; }  // populated via JOIN
    public decimal  QtyUsed    { get; set; }
    public DateTime UsageDate  { get; set; }
    public int?     RecordedBy { get; set; }
    public string?  RecordedByName { get; set; }  // populated via JOIN
}