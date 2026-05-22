using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ManagerUp")]
public class ProductionController : ControllerBase
{
    private readonly ProductionService _productionService;
 
    public ProductionController(ProductionService productionService)
    {
        _productionService = productionService;
    }
 
    // GET /api/production
    [HttpGet]
    public IActionResult GetAll()
    {
        var batches = _productionService.GetAll();
        return Ok(batches);
    }
 
    // POST /api/production
    [HttpPost]
    public IActionResult CreateBatch([FromBody] CreateProductionBatchDto dto)
    {
        var newId = _productionService.CreateBatch(dto);
        return Ok(new { message = "Production batch created.", batchId = newId });
    }
 
    // PUT /api/production/5/status
    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateBatchStatusDto dto)
    {
        _productionService.UpdateStatus(id, dto);
        return Ok(new { message = "Batch status updated." });
    }
}