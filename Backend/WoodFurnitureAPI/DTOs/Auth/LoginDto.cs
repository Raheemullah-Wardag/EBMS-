// LoginDto.cs — what React sends to /api/auth/login
public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}