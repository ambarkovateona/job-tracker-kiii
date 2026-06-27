package mk.finki.kiii.jobtrackerbackend.model.dto;



import mk.finki.kiii.jobtrackerbackend.model.enums.ApplicationStatus;
import java.time.LocalDateTime;

public record StatusHistoryEntryDto(ApplicationStatus status, LocalDateTime changedAt) {
}