public interface IAuthRepository<UserCreateDto>
{
    Task CreateAsync(UserCreateDto userData);
}

internal class AuthRepository<TUserCreate> : IAuthRepository<TUserCreate>
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(TUserCreate userData)
    {
        await _context.AddAsync(userData);
        await _context.SaveChangesAsync();
    }
}