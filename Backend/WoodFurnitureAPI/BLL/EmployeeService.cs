using BCrypt.Net; // Make sure you have this using statement if using BCrypt

public class EmployeeService
{
    private readonly EmployeeRepository _repo;
    private readonly UserRepository _userRepo; // 1. Inject UserRepository

    public EmployeeService(EmployeeRepository repo, UserRepository userRepo)
    {
        _repo = repo;
        _userRepo = userRepo;
    }
 
    public List<EmployeeResponseDto> GetAll()
    {
        return _repo.GetAll().Select(MapToDto).ToList();
    }
 
    public EmployeeResponseDto? GetByID(int id)
    {
        var emp = _repo.GetByID(id);
        return emp == null ? null : MapToDto(emp);
    }
 
    public int Create(EmployeeCreateDto dto)
    {
        // STEP 1: CREATE THE USER ACCOUNT FIRST
        var newUser = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            // Hash the password securely
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), 
            RoleID = 3, // HARDCODED SECURELY TO ROLE 3 (Employee)
            IsActive = true
        };

        // Save User to DB and get the newly generated ID
        int newUserId = _userRepo.Create(newUser);

        // STEP 2: CREATE THE EMPLOYEE RECORD LINKED TO THAT USER
        var employee = new Employee
        {
            UserID     = newUserId, // <--- LINK ESTABLISHED HERE
            FirstName  = dto.FirstName,
            LastName   = dto.LastName,
            NationalID = dto.NationalID,
            Phone      = dto.Phone,
            JobTitle   = dto.JobTitle,
            Department = dto.Department,
            HireDate   = dto.HireDate,
            Salary     = dto.Salary
        };
        
        return _repo.Create(employee);
    }
 
    public bool Update(int id, EmployeeCreateDto dto)
    {
        var existing = _repo.GetByID(id);
        if (existing == null) return false;
 
        existing.FirstName  = dto.FirstName;
        existing.LastName   = dto.LastName;
        existing.Phone      = dto.Phone;
        existing.JobTitle   = dto.JobTitle;
        existing.Department = dto.Department;
        existing.Salary     = dto.Salary;
 
        _repo.Update(existing);
        
        // NOTE: If you want to allow them to update the Password/Email later, 
        // you will need to add logic here to update the _userRepo as well!
        
        return true;
    }
 
    private EmployeeResponseDto MapToDto(Employee e) => new EmployeeResponseDto
    {
        EmployeeID = e.EmployeeID,
        FullName   = e.FullName,
        JobTitle   = e.JobTitle,
        Department = e.Department,
        Phone      = e.Phone,
        HireDate   = e.HireDate,
        Salary     = e.Salary,
        IsActive   = e.IsActive
    };
}