public class ProductionService
{
    private readonly ProductionRepository _repo;
 
    public ProductionService(ProductionRepository repo)
    {
        _repo = repo;
    }
 
    public List<ProductionBatchResponseDto> GetAll()
    {
        return _repo.GetAll().Select(MapToDto).ToList();
    }
 
    public int CreateBatch(CreateProductionBatchDto dto)
    {
        return _repo.CreateBatch(dto);
    }
 
    public void UpdateStatus(int batchId, UpdateBatchStatusDto dto)
    {
        _repo.UpdateStatus(dto, batchId);
    }
 
    private ProductionBatchResponseDto MapToDto(ProductionBatch b) => new ProductionBatchResponseDto
    {
        BatchID        = b.BatchID,
        BatchName      = b.BatchName,
        Status         = b.Status,
        StartDate      = b.StartDate,
        EndDate        = b.EndDate,
        AssignedToName = b.AssignedToName,
        OrderID        = b.OrderID
    };
}
 