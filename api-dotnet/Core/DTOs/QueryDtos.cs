public record QueryDto(
    bool IsPaginated,
    int Page,
    int Limit,
    string? Search, 
    string SortBy
);