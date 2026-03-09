namespace Backend.Models;

public class Product
{
    public int Id { get; set; }

    public string ArticleNumber { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }
}