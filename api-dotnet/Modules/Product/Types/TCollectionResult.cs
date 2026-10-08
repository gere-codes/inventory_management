public record TCollectionResult<T>(
    List<T> items,
    TPagination pagination
);

public record TPagination(
    int Page,
    int Limit,
    int TotalItems,
    int TotalPages
);