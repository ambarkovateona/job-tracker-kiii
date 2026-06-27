package mk.finki.kiii.jobtrackerbackend.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.model.dto.*;
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
    @PatchMapping("/{id}/details")
    public ApplicationResponseDto updateDetails(@AuthenticationPrincipal UserPrincipal principal,
                                                @PathVariable Long id,
                                                @Valid @RequestBody ApplicationDetailsUpdateDto request) {
        return applicationService.updateDetails(principal.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        applicationService.delete(principal.getId(), id);
    }

    @GetMapping("/{id}/history")
    public List<StatusHistoryEntryDto> getHistory(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        return applicationService.getHistory(principal.getId(), id);
    }
}