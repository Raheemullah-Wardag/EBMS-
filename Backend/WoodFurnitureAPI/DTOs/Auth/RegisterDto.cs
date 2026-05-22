 
// RegisterDto.cs — what React sends to /api/auth/register
public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email    { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone   { get; set; }
    public string? Address { get; set; }
    public int    RoleID   { get; set; }
}
 