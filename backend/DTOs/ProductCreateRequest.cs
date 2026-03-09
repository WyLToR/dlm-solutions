namespace Backend.DTOs;

public class ProductCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int UserId { get; set; }
}