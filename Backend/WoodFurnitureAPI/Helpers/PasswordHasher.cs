public class PasswordHasher
{
    // ============================================================
    //  Hash
    //  Called on Register — converts plain password to bcrypt hash
    //  The hash is what gets stored in Users.PasswordHash column
    // ============================================================
    public string Hash(string plainPassword)
    {
        return BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 12);
    }

    // ============================================================
    //  Verify
    //  Called on Login — compares plain password against stored hash
    //  Returns true if match, false if wrong password
    // ============================================================
    public bool Verify(string plainPassword, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(plainPassword, hashedPassword);
    }
}