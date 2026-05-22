// ============================================================
//  CustomOrderSpec.cs
// ============================================================

public class CustomOrderSpec
{
    public int      SpecID         { get; set; }
    public int      OrderID        { get; set; }
    public string   FurnitureType  { get; set; } = string.Empty;
    public string?  WoodType       { get; set; }
    public string?  Finish         { get; set; }
    public string?  Dimensions     { get; set; }
    public string?  SpecialNotes   { get; set; }
    public string?  AttachmentPath { get; set; }
    public decimal? QuotedPrice    { get; set; }
    public int?     ApprovedByID   { get; set; }
    public string?  ApprovedBy     { get; set; }   // populated via JOIN
}