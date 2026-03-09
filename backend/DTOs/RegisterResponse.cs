namespace Backend.DTOs;

public class RegisterResponse
{
    public string Token { get; set; } = string.Empty;

    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;
}