package mk.finki.kiii.jobtrackerbackend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ApplicationRequestDto(
        @NotBlank String companyName,
        String industry,
        @NotBlank String position,
        @NotNull LocalDate appliedDate,
        String notes,
        String recruiterName,
        String salary,
        String location,
        LocalDateTime interviewDateTime
) {
}