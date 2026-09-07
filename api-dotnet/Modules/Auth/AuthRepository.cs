using Microsoft.EntityFrameworkCore;

public interface IAuthRepository
{
    Task CreateAsync(User user);
    Task<User?> FindByEmailAsync(string email);
}

internal class AuthRepository : IAuthRepository
{
    private readonly AppDbContext _context;

    public AuthRepository(AppDbContext context)
    {
        _context = context;
    }



    public async Task CreateAsync(User user)
    {

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }


    public async Task<User?> FindByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync<User>((u)=> u.Email == email);
    }
}