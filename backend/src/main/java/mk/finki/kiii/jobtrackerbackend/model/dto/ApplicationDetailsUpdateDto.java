package mk.finki.kiii.jobtrackerbackend.model.dto;



import java.time.LocalDateTime;

public record ApplicationDetailsUpdateDto(
        String recruiterName,
        String salary,
        String location,
        LocalDateTime interviewDateTime,
        String notes
) {
}