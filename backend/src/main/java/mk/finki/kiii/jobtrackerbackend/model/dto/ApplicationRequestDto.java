package mk.finki.kiii.jobtrackerbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ApplicationRequestDto(
        @NotBlank String companyName,
        String industry,
        @NotBlank String position,
        @NotNull LocalDate appliedDate,
        String notes
) {
}