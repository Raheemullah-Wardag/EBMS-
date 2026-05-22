public class RawMaterialService
{
    private readonly RawMaterialRepository _repo;

    public RawMaterialService(RawMaterialRepository repo)
    {
        _repo = repo;
    }

    public List<RawMaterialResponseDto> GetAll()
    {
        return _repo.GetAll().Select(MapToDto).ToList();
    }

    public RawMaterialResponseDto? GetByID(int id)
    {
        var rm = _repo.GetByID(id);
        return rm == null ? null : MapToDto(rm);
    }

    public int Create(RawMaterialCreateDto dto)
    {
        var rawMaterial = new RawMaterial
        {
            MaterialName = dto.MaterialName,
            Unit = dto.Unit,
            StockQty = dto.StockQty,
            ReorderLevel = dto.ReorderLevel,
            CostPerUnit = dto.CostPerUnit,
            Supplier = dto.Supplier
        };
        return _repo.Create(rawMaterial);
    }

    public bool Update(int id, RawMaterialCreateDto dto)
    {
        var existing = _repo.GetByID(id);
        if (existing == null) return false;

        existing.MaterialName = dto.MaterialName;
        existing.Unit = dto.Unit;
        existing.StockQty = dto.StockQty;
        existing.ReorderLevel = dto.ReorderLevel;
        existing.CostPerUnit = dto.CostPerUnit;
        existing.Supplier = dto.Supplier;

        _repo.Update(existing);
        return true;
    }

    private RawMaterialResponseDto MapToDto(RawMaterial rm) => new RawMaterialResponseDto
    {
        MaterialID = rm.MaterialID,
        MaterialName = rm.MaterialName,
        Unit = rm.Unit,
        StockQty = rm.StockQty,
        ReorderLevel = rm.ReorderLevel,
        CostPerUnit = rm.CostPerUnit,
        Supplier = rm.Supplier,
        StockStatus = rm.StockStatus
    };
}