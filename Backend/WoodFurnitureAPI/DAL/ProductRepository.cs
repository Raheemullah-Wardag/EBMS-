using Microsoft.Data.SqlClient;
using System.Data;

public class ProductRepository : BaseRepository
{
    public ProductRepository(string connectionString) : base(connectionString) { }

    public List<Product> GetAll()
    {
        var list = new List<Product>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT P.*, PC.CategoryName 
            FROM Products P
            INNER JOIN ProductCategories PC ON P.CategoryID = PC.CategoryID
            WHERE P.IsActive = 1
            ORDER BY P.ProductName", conn);

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapProduct(reader));

        return list;
    }

    public Product? GetByID(int id)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT P.*, PC.CategoryName 
            FROM Products P
            INNER JOIN ProductCategories PC ON P.CategoryID = PC.CategoryID
            WHERE P.ProductID = @ID", conn);
        cmd.Parameters.AddWithValue("@ID", id);

        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapProduct(reader) : null;
    }

    public int Create(Product p)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            INSERT INTO Products 
                (CategoryID, ProductName, SKU, Description, Material, Dimensions, WeightKG, BasePrice, StockQty, ReorderLevel)
            VALUES 
                (@CategoryID, @ProductName, @SKU, @Description, @Material, @Dimensions, @WeightKG, @BasePrice, @StockQty, @ReorderLevel);
            SELECT SCOPE_IDENTITY();", conn);

        cmd.Parameters.AddWithValue("@CategoryID",   p.CategoryID);
        cmd.Parameters.AddWithValue("@ProductName",  p.ProductName);
        cmd.Parameters.AddWithValue("@SKU",          p.SKU);
        cmd.Parameters.AddWithValue("@Description",  (object?)p.Description ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Material",     (object?)p.Material    ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Dimensions",   (object?)p.Dimensions  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@WeightKG",     (object?)p.WeightKG    ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@BasePrice",    p.BasePrice);
        cmd.Parameters.AddWithValue("@StockQty",     p.StockQty);
        cmd.Parameters.AddWithValue("@ReorderLevel", p.ReorderLevel);

        return Convert.ToInt32(cmd.ExecuteScalar());
    }

    public void Update(Product p)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            UPDATE Products SET
                CategoryID   = @CategoryID,
                ProductName  = @ProductName,
                Description  = @Description,
                Material     = @Material,
                Dimensions   = @Dimensions,
                BasePrice    = @BasePrice,
                ReorderLevel = @ReorderLevel,
                StockQty = @StockQty,
                UpdatedAt    = SYSUTCDATETIME()
            WHERE ProductID = @ProductID", conn);

        cmd.Parameters.AddWithValue("@ProductID",    p.ProductID);
        cmd.Parameters.AddWithValue("@CategoryID",   p.CategoryID);
        cmd.Parameters.AddWithValue("@ProductName",  p.ProductName);
        cmd.Parameters.AddWithValue("@Description",  (object?)p.Description ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Material",     (object?)p.Material    ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Dimensions",   (object?)p.Dimensions  ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockQty",    p.StockQty);
        cmd.Parameters.AddWithValue("@BasePrice",    p.BasePrice);
        cmd.Parameters.AddWithValue("@ReorderLevel", p.ReorderLevel);

        cmd.ExecuteNonQuery();
    }

    public void Delete(int id)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(
            "UPDATE Products SET IsActive = 0 WHERE ProductID = @ID", conn);
        cmd.Parameters.AddWithValue("@ID", id);
        cmd.ExecuteNonQuery();
    }

    // ── Image methods ──────────────────────────────────────────────
    public List<ProductImage> GetImagesByProductID(int productId)
    {
        var list = new List<ProductImage>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM ProductImages 
            WHERE ProductID = @ID 
            ORDER BY IsMain DESC, SortOrder ASC", conn);
        cmd.Parameters.AddWithValue("@ID", productId);

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(new ProductImage
            {
                ImageID   = (int)reader["ImageID"],
                ProductID = (int)reader["ProductID"],
                ImagePath = reader["ImagePath"].ToString()!,
                AltText   = reader["AltText"]   == DBNull.Value ? null : reader["AltText"].ToString(),
                IsMain    = (bool)reader["IsMain"],
                SortOrder = (int)reader["SortOrder"]
            });

        return list;
    }

    public void AddImage(int productId, string imagePath, string? altText, bool isMain, int sortOrder)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            INSERT INTO ProductImages (ProductID, ImagePath, AltText, IsMain, SortOrder)
            VALUES (@ProductID, @ImagePath, @AltText, @IsMain, @SortOrder)", conn);

        cmd.Parameters.AddWithValue("@ProductID",  productId);
        cmd.Parameters.AddWithValue("@ImagePath",  imagePath);
        cmd.Parameters.AddWithValue("@AltText",    (object?)altText ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@IsMain",     isMain);
        cmd.Parameters.AddWithValue("@SortOrder",  sortOrder);
        cmd.ExecuteNonQuery();
    }

    public void DeleteImage(int imageId)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(
            "DELETE FROM ProductImages WHERE ImageID = @ID", conn);
        cmd.Parameters.AddWithValue("@ID", imageId);
        cmd.ExecuteNonQuery();
    }

    // ── Mapper ─────────────────────────────────────────────────────
    private Product MapProduct(SqlDataReader r) => new Product
    {
        ProductID    = (int)r["ProductID"],
        CategoryID   = (int)r["CategoryID"],
        CategoryName = r["CategoryName"].ToString(),
        ProductName  = r["ProductName"].ToString()!,
        SKU          = r["SKU"].ToString()!,
        Description  = r["Description"] == DBNull.Value ? null : r["Description"].ToString(),
        Material     = r["Material"]    == DBNull.Value ? null : r["Material"].ToString(),
        Dimensions   = r["Dimensions"]  == DBNull.Value ? null : r["Dimensions"].ToString(),
        WeightKG     = r["WeightKG"]    == DBNull.Value ? null : (decimal)r["WeightKG"],
        BasePrice    = (decimal)r["BasePrice"],
        StockQty     = (int)r["StockQty"],
        ReorderLevel = (int)r["ReorderLevel"],
        IsActive     = (bool)r["IsActive"],
        CreatedAt    = (DateTime)r["CreatedAt"],
        UpdatedAt    = (DateTime)r["UpdatedAt"]
    };
}