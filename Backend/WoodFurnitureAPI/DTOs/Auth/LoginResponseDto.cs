
// LoginResponseDto.cs — what API sends back after successful login
public class LoginResponseDto
{
    public string Token    { get; set; } = string.Empty;
    public int    UserID   { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email    { get; set; } = string.Empty;
    public string Role     { get; set; } = string.Empty;
}