using Backend.DTOs;

namespace Backend.Services.Interfaces;

public interface IProductService
{
    Task<List<ProductResponse>> GetAllAsync(int userId);
    Task<ProductResponse?> GetByIdAsync(int id, int userId);
    Task<ProductResponse> CreateAsync(ProductCreateRequest request, int userId);
    Task<bool> UpdateAsync(int id, ProductUpdateRequest request, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}