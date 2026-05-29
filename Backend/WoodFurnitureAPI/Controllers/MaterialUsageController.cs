using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ManagerUp")]
public class MaterialUsageController : ControllerBase
{
    private readonly ProductionRepository _productionRepo;
    
    public MaterialUsageController(ProductionRepository productionRepo)
    {
        _productionRepo = productionRepo;
    }

    // POST /api/materialusage/allocate
    // Allocates raw materials to a production batch
    [HttpPost("allocate")]
    public IActionResult AllocateMaterials([FromBody] AllocateMaterialsDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int recordedBy = userIdClaim != null ? int.Parse(userIdClaim) : 0;

            foreach (var material in dto.Materials)
            {
                _productionRepo.AllocateMaterial(dto.BatchID, material.MaterialID, material.QtyUsed, recordedBy);
            }

            return Ok(new { message = "Materials allocated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class AllocateMaterialsDto
{
    public int BatchID { get; set; }
    public List<MaterialAllocationItem> Materials { get; set; } = new();
}

public class MaterialAllocationItem
{
    public int MaterialID { get; set; }
    public decimal QtyUsed { get; set; }
}
