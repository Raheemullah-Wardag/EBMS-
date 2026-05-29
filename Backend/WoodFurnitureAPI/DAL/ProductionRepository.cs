using Microsoft.Data.SqlClient;
using System.Data;
public class ProductionRepository : BaseRepository
{
    public ProductionRepository(string connectionString) : base(connectionString) { }
 
    public List<ProductionBatch> GetAll()
    {
        var list = new List<ProductionBatch>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_ProductionBatches ORDER BY BatchID DESC", conn);
 
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapBatch(reader));
 
        return list;
    }
 
    // Calls sp_CreateProductionBatch stored procedure
    public int CreateBatch(CreateProductionBatchDto dto)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_CreateProductionBatch", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@OrderID",         (object?)dto.OrderID   ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@BatchName",       dto.BatchName);
        cmd.Parameters.AddWithValue("@StartDate",       dto.StartDate);
        cmd.Parameters.AddWithValue("@EndDate",         dto.EndDate);
        cmd.Parameters.AddWithValue("@AssignedTo",      dto.AssignedTo);
        cmd.Parameters.AddWithValue("@ProductID",       (object?)dto.ProductID ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@SpecID",          (object?)dto.SpecID    ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@QuantityPlanned", dto.QuantityPlanned);
 
        using var reader = cmd.ExecuteReader();
        reader.Read();
        return (int)reader["NewBatchID"];
    }
 
    // Calls sp_UpdateBatchStatus stored procedure
    public void UpdateStatus(UpdateBatchStatusDto dto, int batchId)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand("sp_UpdateBatchStatus", conn);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;
 
        cmd.Parameters.AddWithValue("@BatchID",      batchId);
        cmd.Parameters.AddWithValue("@NewStatus",    dto.NewStatus);
        cmd.Parameters.AddWithValue("@QuantityMade", dto.QuantityMade);
 
        cmd.ExecuteNonQuery();
    }

    // Allocate raw materials to a production batch (trigger handles deduction)
    public void AllocateMaterial(int batchId, int materialId, decimal qtyUsed, int recordedBy)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            INSERT INTO MaterialUsage (BatchID, MaterialID, QtyUsed, UsageDate, RecordedBy)
            VALUES (@BatchID, @MaterialID, @QtyUsed, CAST(SYSUTCDATETIME() AS DATE), @RecordedBy)", conn);
 
        cmd.Parameters.AddWithValue("@BatchID",     batchId);
        cmd.Parameters.AddWithValue("@MaterialID",  materialId);
        cmd.Parameters.AddWithValue("@QtyUsed",     qtyUsed);
        cmd.Parameters.AddWithValue("@RecordedBy",  recordedBy);
 
        cmd.ExecuteNonQuery();
    }
 
    private ProductionBatch MapBatch(SqlDataReader r) => new ProductionBatch
    {
        BatchID        = (int)r["BatchID"],
        OrderID        = r["OrderID"]    == DBNull.Value ? null : (int?)r["OrderID"],
        BatchName      = r["BatchName"].ToString()!,
        Status         = r["BatchStatus"].ToString()!,
        StartDate      = r["StartDate"]  == DBNull.Value ? null : (DateTime?)r["StartDate"],
        EndDate        = r["EndDate"]    == DBNull.Value ? null : (DateTime?)r["EndDate"],
        AssignedToName = r["AssignedTo"] == DBNull.Value ? null : r["AssignedTo"].ToString()
    };
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
            AltText   = reader["AltText"] == DBNull.Value ? null : reader["AltText"].ToString(),
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
}
 
 