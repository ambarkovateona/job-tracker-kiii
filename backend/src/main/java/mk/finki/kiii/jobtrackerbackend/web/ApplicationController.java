package mk.finki.kiii.jobtrackerbackend.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationRequestDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationResponseDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.StatusUpdateRequestDto;
import mk.finki.kiii.jobtrackerbackend.security.UserPrincipal;
import mk.finki.kiii.jobtrackerbackend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponseDto create(@AuthenticationPrincipal UserPrincipal principal,
                                         @Valid @RequestBody ApplicationRequestDto request) {
        return applicationService.create(principal.getId(), request);
    }

    @GetMapping
    public List<ApplicationResponseDto> listMine(@AuthenticationPrincipal UserPrincipal principal) {
        return applicationService.listMine(principal.getId());
    }

    @PatchMapping("/{id}/status")
    public ApplicationResponseDto updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable Long id,
                                               @Valid @RequestBody StatusUpdateRequestDto request) {
        return applicationService.updateStatus(principal.getId(), id, request.newStatus());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        applicationService.delete(principal.getId(), id);
    }
}