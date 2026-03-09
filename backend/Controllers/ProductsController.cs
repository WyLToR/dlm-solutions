using Backend.DTOs;
using Backend.Services.Interfaces;
using Backend.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = this.GetUserId();
        var products = await _productService.GetAllAsync(userId);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = this.GetUserId();
        var product = await _productService.GetByIdAsync(id, userId);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateRequest request)
    {
        var userId = this.GetUserId();
        var createdProduct = await _productService.CreateAsync(request, userId);
        return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateRequest request)
    {
        var userId = this.GetUserId();
        var updated = await _productService.UpdateAsync(id, request, userId);

        if (!updated)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = this.GetUserId();
        var deleted = await _productService.DeleteAsync(id, userId);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}