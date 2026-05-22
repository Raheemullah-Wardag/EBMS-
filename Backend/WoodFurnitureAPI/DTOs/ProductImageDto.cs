public class ProductImageDto
{
    public int     ImageID   { get; set; }
    public string  ImagePath { get; set; } = string.Empty;
    public string? AltText   { get; set; }
    public bool    IsMain    { get; set; }
    public int     SortOrder { get; set; }
}