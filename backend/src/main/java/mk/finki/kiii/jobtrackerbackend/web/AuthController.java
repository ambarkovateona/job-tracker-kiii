package mk.finki.kiii.jobtrackerbackend.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.model.dto.RegisterRequestDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.UserResponseDto;
import mk.finki.kiii.jobtrackerbackend.security.UserPrincipal;
import mk.finki.kiii.jobtrackerbackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDto register(@Valid @RequestBody RegisterRequestDto request) {
        return userService.register(request);
    }

    @GetMapping("/me")
    public UserResponseDto me(@AuthenticationPrincipal UserPrincipal principal) {
        return userService.getCurrentUser(principal.getId());
    }
}