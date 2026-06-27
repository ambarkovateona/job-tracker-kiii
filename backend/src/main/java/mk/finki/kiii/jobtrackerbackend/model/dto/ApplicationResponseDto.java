package mk.finki.kiii.jobtrackerbackend.model.dto;

import mk.finki.kiii.jobtrackerbackend.model.enums.ApplicationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ApplicationResponseDto(
        Long id,
        String companyName,
        String position,
        ApplicationStatus status,
        LocalDate appliedDate,
        LocalDate lastUpdated,
        String notes,
        String recruiterName,
        String salary,
        String location,
        LocalDateTime interviewDateTime
) {
}