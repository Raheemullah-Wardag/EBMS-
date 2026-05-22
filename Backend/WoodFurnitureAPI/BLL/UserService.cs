public class UserService
{
    private readonly UserRepository _repo;

    public UserService(UserRepository repo)
    {
        _repo = repo;
    }

    public List<User> GetAll()
    {
        return _repo.GetAll();
    }
}