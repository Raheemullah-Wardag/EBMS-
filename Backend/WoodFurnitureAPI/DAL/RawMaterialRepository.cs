using Microsoft.Data.SqlClient;
using System.Data;

public class RawMaterialRepository : BaseRepository
{
    public RawMaterialRepository(string connectionString) : base(connectionString) { }

    public List<RawMaterial> GetAll()
    {
        var list = new List<RawMaterial>();
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_RawMaterialStock ORDER BY MaterialName", conn);

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
            list.Add(MapRawMaterial(reader));

        return list;
    }

    public RawMaterial? GetByID(int id)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            SELECT * FROM vw_RawMaterialStock WHERE MaterialID = @ID", conn);
        cmd.Parameters.AddWithValue("@ID", id);

        using var reader = cmd.ExecuteReader();
        return reader.Read() ? MapRawMaterial(reader) : null;
    }

    public int Create(RawMaterial rm)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            INSERT INTO RawMaterials
                (MaterialName, Unit, StockQty, ReorderLevel, CostPerUnit, Supplier)
            VALUES
                (@MaterialName, @Unit, @StockQty, @ReorderLevel, @CostPerUnit, @Supplier);
            SELECT SCOPE_IDENTITY();", conn);

        cmd.Parameters.AddWithValue("@MaterialName", rm.MaterialName);
        cmd.Parameters.AddWithValue("@Unit", rm.Unit);
        cmd.Parameters.AddWithValue("@StockQty", rm.StockQty);
        cmd.Parameters.AddWithValue("@ReorderLevel", rm.ReorderLevel);
        cmd.Parameters.AddWithValue("@CostPerUnit", rm.CostPerUnit);
        cmd.Parameters.AddWithValue("@Supplier", (object?)rm.Supplier ?? DBNull.Value);

        return Convert.ToInt32(cmd.ExecuteScalar());
    }

    public void Update(RawMaterial rm)
    {
        using var conn = GetConnection();
        conn.Open();
        using var cmd = new SqlCommand(@"
            UPDATE RawMaterials SET
                MaterialName = @MaterialName,
                Unit = @Unit,
                StockQty = @StockQty,
                ReorderLevel = @ReorderLevel,
                CostPerUnit = @CostPerUnit,
                Supplier = @Supplier,
                UpdatedAt = SYSUTCDATETIME()
            WHERE MaterialID = @MaterialID", conn);

        cmd.Parameters.AddWithValue("@MaterialID", rm.MaterialID);
        cmd.Parameters.AddWithValue("@MaterialName", rm.MaterialName);
        cmd.Parameters.AddWithValue("@Unit", rm.Unit);
        cmd.Parameters.AddWithValue("@StockQty", rm.StockQty);
        cmd.Parameters.AddWithValue("@ReorderLevel", rm.ReorderLevel);
        cmd.Parameters.AddWithValue("@CostPerUnit", rm.CostPerUnit);
        cmd.Parameters.AddWithValue("@Supplier", (object?)rm.Supplier ?? DBNull.Value);

        cmd.ExecuteNonQuery();
    }

    private RawMaterial MapRawMaterial(SqlDataReader r) => new RawMaterial
    {
        MaterialID = (int)r["MaterialID"],
        MaterialName = r["MaterialName"].ToString()!,
        Unit = r["Unit"].ToString()!,
        StockQty = (decimal)r["StockQty"],
        ReorderLevel = (decimal)r["ReorderLevel"],
        CostPerUnit = (decimal)r["CostPerUnit"],
        Supplier = r["Supplier"] == DBNull.Value ? null : r["Supplier"].ToString(),
        UpdatedAt = DateTime.Now // Not in view, but required
    };
}