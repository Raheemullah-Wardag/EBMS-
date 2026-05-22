using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ManagerUp")]
public class RawMaterialsController : ControllerBase
{
    private readonly RawMaterialService _rawMaterialService;

    public RawMaterialsController(RawMaterialService rawMaterialService)
    {
        _rawMaterialService = rawMaterialService;
    }

    // GET /api/rawmaterials
    [HttpGet]
    public IActionResult GetAll()
    {
        var rawMaterials = _rawMaterialService.GetAll();
        return Ok(rawMaterials);
    }

    // GET /api/rawmaterials/5
    [HttpGet("{id}")]
    public IActionResult GetByID(int id)
    {
        var rm = _rawMaterialService.GetByID(id);
        if (rm == null)
            return NotFound(new { message = "Raw material not found." });

        return Ok(rm);
    }

    // POST /api/rawmaterials
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Create([FromBody] RawMaterialCreateDto dto)
    {
        var newId = _rawMaterialService.Create(dto);
        return Ok(new { message = "Raw material created.", materialId = newId });
    }

    // PUT /api/rawmaterials/5
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Update(int id, [FromBody] RawMaterialCreateDto dto)
    {
        var success = _rawMaterialService.Update(id, dto);
        if (!success)
            return NotFound(new { message = "Raw material not found." });

        return Ok(new { message = "Raw material updated." });
    }
}