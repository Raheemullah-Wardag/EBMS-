public class AuthService
{
    private readonly UserRepository     _userRepo;
    private readonly CustomerRepository _customerRepo;
    private readonly PasswordHasher     _hasher;
    private readonly JwtHelper          _jwt;
 
    public AuthService(UserRepository userRepo, CustomerRepository customerRepo, PasswordHasher hasher, JwtHelper jwt)
    {
        _userRepo     = userRepo;
        _customerRepo = customerRepo;
        _hasher       = hasher;
        _jwt          = jwt;
    }
 
    public LoginResponseDto? Login(LoginDto dto)
    {
        // 1. Get user from DB by username
        var user = _userRepo.GetByUsername(dto.Username);
        if (user == null) return null;
 
        // 2. Verify password against stored hash
        if (!_hasher.Verify(dto.Password, user.PasswordHash)) return null;
 
        // 3. Generate JWT token
        var token = _jwt.GenerateToken(user.UserID, user.Username, user.Email, user.RoleName!);
 
        // 4. Return response DTO (no PasswordHash exposed)
        return new LoginResponseDto
        {
            Token    = token,
            UserID   = user.UserID,
            Username = user.Username,
            Email    = user.Email,
            Role     = user.RoleName!
        };
    }
 public (bool Success, string Message) Register(RegisterDto dto)
{
    if (_userRepo.Exists(dto.Username, dto.Email))
        return (false, "Username or email already exists.");

    var hashed = _hasher.Hash(dto.Password);

    var user = new User
    {
        Username     = dto.Username,
        Email        = dto.Email,
        PasswordHash = hashed,
        RoleID       = dto.RoleID
    };

    int newUserId = _userRepo.Create(user);

    // FIX: Allow BOTH Role 4 (Individual) and Role 5 (Business) to become customers
    if (dto.RoleID == 4 || dto.RoleID == 5) 
    {
        var customer = new Customer
        {
            UserID       = newUserId,
            // Dynamically set type based on frontend selection
            CustomerType = dto.RoleID == 4 ? "Individual" : "Business", 
            FirstName    = dto.Username,
            Email        = dto.Email,
            Phone        = dto.Phone,     // Map the new field
            Address      = dto.Address    // Map the new field
        };
        _customerRepo.Create(customer);
    }

    return (true, "User registered successfully.");
}
}
 