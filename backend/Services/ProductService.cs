using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponse>> GetAllAsync(int userId)
    {
        return await _context.Products
            .Where(p => p.UserId == userId)
            .Select(p => new ProductResponse
            {
                Id = p.Id,
                ArticleNumber = p.ArticleNumber,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                UserId = p.UserId
            })
            .ToListAsync();
    }

    public async Task<ProductResponse?> GetByIdAsync(int id, int userId)
    {
        return await _context.Products
            .Where(p => p.Id == id && p.UserId == userId)
            .Select(p => new ProductResponse
            {
                Id = p.Id,
                ArticleNumber = p.ArticleNumber,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                UserId = p.UserId
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ProductResponse> CreateAsync(ProductCreateRequest request, int userId)
    {
        var lastProduct = await _context.Products
            .OrderByDescending(p => p.Id)
            .FirstOrDefaultAsync();

        int nextNumber = 1;

        if (lastProduct != null &&
            !string.IsNullOrWhiteSpace(lastProduct.ArticleNumber) &&
            lastProduct.ArticleNumber.StartsWith("PRD-"))
        {
            var numberPart = lastProduct.ArticleNumber.Replace("PRD-", "");

            if (int.TryParse(numberPart, out var lastNumber))
            {
                nextNumber = lastNumber + 1;
            }
        }

        var articleNumber = $"PRD-{nextNumber:D3}";

        var product = new Product
        {
            ArticleNumber = articleNumber,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            UserId = userId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductResponse
        {
            Id = product.Id,
            ArticleNumber = product.ArticleNumber,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            UserId = product.UserId
        };
    }

    public async Task<bool> UpdateAsync(int id, ProductUpdateRequest request, int userId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (product == null)
            return false;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (product == null)
            return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }
}