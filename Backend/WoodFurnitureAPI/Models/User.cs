// ============================================================
//  User.cs
// ============================================================
public class User
{
    public int      UserID       { get; set; }
    public string   Username     { get; set; } = string.Empty;
    public string   Email        { get; set; } = string.Empty;
    public string   PasswordHash { get; set; } = string.Empty;
    public int      RoleID       { get; set; }
    public string?  RoleName     { get; set; }   // populated via JOIN in queries
    public bool     IsActive     { get; set; } = true;
    public DateTime CreatedAt    { get; set; }
    public DateTime UpdatedAt    { get; set; }
}
 