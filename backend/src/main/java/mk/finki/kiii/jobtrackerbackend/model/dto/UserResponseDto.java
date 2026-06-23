package mk.finki.kiii.jobtrackerbackend.model.dto;

public record UserResponseDto(
        Long id,
        String email,
        String firstName,
        String lastName
) {
}