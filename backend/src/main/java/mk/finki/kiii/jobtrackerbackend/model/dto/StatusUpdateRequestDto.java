package mk.finki.kiii.jobtrackerbackend.model.dto;

import jakarta.validation.constraints.NotNull;
import mk.finki.kiii.jobtrackerbackend.model.enums.ApplicationStatus;

public record StatusUpdateRequestDto(@NotNull ApplicationStatus newStatus) {
}