package mk.finki.kiii.jobtrackerbackend.model.dto;

import mk.finki.kiii.jobtrackerbackend.model.enums.ApplicationStatus;
import java.time.LocalDate;

public record ApplicationResponseDto(
        Long id,
        String companyName,
        String position,
        ApplicationStatus status,
        LocalDate appliedDate,
        LocalDate lastUpdated,
        String notes
) {
}