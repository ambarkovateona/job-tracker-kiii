package mk.finki.kiii.jobtrackerbackend.service;

import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.exception.EmailAlreadyExistsException;
import mk.finki.kiii.jobtrackerbackend.model.User;
import mk.finki.kiii.jobtrackerbackend.model.dto.RegisterRequestDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.UserResponseDto;
import mk.finki.kiii.jobtrackerbackend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto register(RegisterRequestDto request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .build();

        return toResponse(userRepository.save(user));
    }

    public UserResponseDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
        return toResponse(user);
    }

    private UserResponseDto toResponse(User user) {
        return new UserResponseDto(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());
    }
}