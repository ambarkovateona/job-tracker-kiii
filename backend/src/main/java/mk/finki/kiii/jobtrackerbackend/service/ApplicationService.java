package mk.finki.kiii.jobtrackerbackend.service;

import lombok.RequiredArgsConstructor;
import mk.finki.kiii.jobtrackerbackend.exception.ApplicationNotFoundException;
import mk.finki.kiii.jobtrackerbackend.exception.InvalidStatusTransitionException;
import mk.finki.kiii.jobtrackerbackend.model.Application;
import mk.finki.kiii.jobtrackerbackend.model.ApplicationStatusHistory;
import mk.finki.kiii.jobtrackerbackend.model.Company;
import mk.finki.kiii.jobtrackerbackend.model.User;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationDetailsUpdateDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationRequestDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationResponseDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.StatusHistoryEntryDto;
import mk.finki.kiii.jobtrackerbackend.model.enums.ApplicationStatus;
import mk.finki.kiii.jobtrackerbackend.repository.ApplicationRepository;
import mk.finki.kiii.jobtrackerbackend.repository.ApplicationStatusHistoryRepository;
import mk.finki.kiii.jobtrackerbackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED_TRANSITIONS = Map.of(
            ApplicationStatus.APPLIED, Set.of(ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN),
            ApplicationStatus.INTERVIEW, Set.of(ApplicationStatus.OFFER, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN),
            ApplicationStatus.OFFER, Set.of(ApplicationStatus.WITHDRAWN),
            ApplicationStatus.REJECTED, Set.of(),
            ApplicationStatus.WITHDRAWN, Set.of()
    );

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final CompanyService companyService;

    private final ApplicationStatusHistoryRepository statusHistoryRepository;

    private void recordStatusChange(Application application, ApplicationStatus status) {
        statusHistoryRepository.save(ApplicationStatusHistory.builder()
                .application(application)
                .status(status)
                .changedAt(LocalDateTime.now())
                .build());
    }

    @Transactional
    public ApplicationResponseDto create(Long userId, ApplicationRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));

        Company company = companyService.findOrCreate(request.companyName(), request.industry());

        Application application = Application.builder()
                .user(user)
                .company(company)
                .position(request.position())
                .status(ApplicationStatus.APPLIED)
                .appliedDate(request.appliedDate())
                .notes(request.notes())
                .recruiterName(request.recruiterName())
                .salary(request.salary())
                .location(request.location())
                .interviewDateTime(request.interviewDateTime())
                .build();

        Application saved = applicationRepository.save(application);
        recordStatusChange(saved, ApplicationStatus.APPLIED);
        return toResponse(saved);
    }

    public List<ApplicationResponseDto> listMine(Long userId) {
        return applicationRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponseDto updateStatus(Long userId, Long applicationId, ApplicationStatus newStatus) {
        Application application = getOwnedApplication(userId, applicationId);

        if (!ALLOWED_TRANSITIONS.get(application.getStatus()).contains(newStatus)) {
            throw new InvalidStatusTransitionException(
                    "Cannot transition from " + application.getStatus() + " to " + newStatus);
        }

        application.setStatus(newStatus);
        application.setLastUpdated(LocalDate.now());
        recordStatusChange(application, newStatus);
        return toResponse(application);
    }

    @Transactional
    public ApplicationResponseDto updateDetails(Long userId, Long applicationId, ApplicationDetailsUpdateDto request) {
        Application application = getOwnedApplication(userId, applicationId);

        if (request.recruiterName() != null) {
            application.setRecruiterName(request.recruiterName());
        }
        if (request.salary() != null) {
            application.setSalary(request.salary());
        }
        if (request.location() != null) {
            application.setLocation(request.location());
        }
        if (request.interviewDateTime() != null) {
            application.setInterviewDateTime(request.interviewDateTime());
        }
        if (request.notes() != null) {
            application.setNotes(request.notes());
        }

        return toResponse(application);
    }

    @Transactional
    public void delete(Long userId, Long applicationId) {
        applicationRepository.delete(getOwnedApplication(userId, applicationId));
    }

    private Application getOwnedApplication(Long userId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException(applicationId));

        if (!application.getUser().getId().equals(userId)) {
            throw new ApplicationNotFoundException(applicationId);
        }
        return application;
    }

    private ApplicationResponseDto toResponse(Application a) {
        return new ApplicationResponseDto(
                a.getId(), a.getCompany().getName(), a.getPosition(),
                a.getStatus(), a.getAppliedDate(), a.getLastUpdated(), a.getNotes(),
                a.getRecruiterName(), a.getSalary(), a.getLocation(), a.getInterviewDateTime()
        );
    }

    public List<StatusHistoryEntryDto> getHistory(Long userId, Long applicationId) {
        getOwnedApplication(userId, applicationId);
        return statusHistoryRepository.findByApplicationIdOrderByChangedAtAsc(applicationId).stream()
                .map(h -> new StatusHistoryEntryDto(h.getStatus(), h.getChangedAt()))
                .toList();
    }
}