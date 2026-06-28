package mk.finki.kiii.jobtrackerbackend.service;

import mk.finki.kiii.jobtrackerbackend.exception.ApplicationNotFoundException;
import mk.finki.kiii.jobtrackerbackend.exception.InvalidStatusTransitionException;
import mk.finki.kiii.jobtrackerbackend.model.Application;
import mk.finki.kiii.jobtrackerbackend.model.Company;
import mk.finki.kiii.jobtrackerbackend.model.User;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationDetailsUpdateDto;
import mk.finki.kiii.jobtrackerbackend.model.dto.ApplicationRequestDto;
import mk.finki.kiii.jobtrackerbackend.model.enums.ApplicationStatus;
import mk.finki.kiii.jobtrackerbackend.repository.ApplicationRepository;
import mk.finki.kiii.jobtrackerbackend.repository.ApplicationStatusHistoryRepository;
import mk.finki.kiii.jobtrackerbackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock private ApplicationRepository applicationRepository;
    @Mock private UserRepository userRepository;
    @Mock private CompanyService companyService;
    @Mock private ApplicationStatusHistoryRepository statusHistoryRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private Application application;

    @BeforeEach
    void setUp() {
        User owner = User.builder().id(1L).build();
        Company company = Company.builder().name("Netcetera").build();

        application = Application.builder()
                .id(10L)
                .user(owner)
                .company(company)
                .position("Backend Engineer")
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .build();
    }

    // --- create() ---

    @Test
    void create_setsInitialStatusToApplied_andRecordsHistory() {
        User owner = User.builder().id(1L).build();
        Company company = Company.builder().name("Google").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(companyService.findOrCreate("Google", "IT")).thenReturn(company);
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));

        ApplicationRequestDto request = new ApplicationRequestDto(
                "Google", "IT", "Backend Intern", LocalDate.now(), null, null, null, null, null);

        var result = applicationService.create(1L, request);

        assertThat(result.status()).isEqualTo(ApplicationStatus.APPLIED);
        verify(statusHistoryRepository).save(any());
    }

    // --- updateStatus() ---

    @Test
    void updateStatus_allowsValidTransition_appliedToInterview() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        var result = applicationService.updateStatus(1L, 10L, ApplicationStatus.INTERVIEW);

        assertThat(result.status()).isEqualTo(ApplicationStatus.INTERVIEW);
    }

    @Test
    void updateStatus_rejectsInvalidTransition_rejectedCannotMoveToOffer() {
        application.setStatus(ApplicationStatus.REJECTED);
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(1L, 10L, ApplicationStatus.OFFER))
                .isInstanceOf(InvalidStatusTransitionException.class);
    }

    @Test
    void updateStatus_rejectsInvalidTransition_withdrawnIsTerminal() {
        application.setStatus(ApplicationStatus.WITHDRAWN);
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(1L, 10L, ApplicationStatus.APPLIED))
                .isInstanceOf(InvalidStatusTransitionException.class);
    }

    @Test
    void updateStatus_throwsNotFound_whenApplicationDoesNotExist() {
        when(applicationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.updateStatus(1L, 999L, ApplicationStatus.INTERVIEW))
                .isInstanceOf(ApplicationNotFoundException.class);
    }

    @Test
    void updateStatus_throwsNotFound_whenApplicationBelongsToAnotherUser() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(999L, 10L, ApplicationStatus.INTERVIEW))
                .isInstanceOf(ApplicationNotFoundException.class);
    }

    // --- updateDetails() - regression test for the partial-update bug fixed earlier ---

    @Test
    void updateDetails_onlyUpdatesProvidedFields_leavesOthersUnchanged() {
        application.setRecruiterName("Marija K.");
        application.setLocation("Skopje");
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        ApplicationDetailsUpdateDto request = new ApplicationDetailsUpdateDto(null, "50000-60000 MKD", null, null, null);

        var result = applicationService.updateDetails(1L, 10L, request);

        assertThat(result.salary()).isEqualTo("50000-60000 MKD");
        assertThat(result.recruiterName()).isEqualTo("Marija K.");
        assertThat(result.location()).isEqualTo("Skopje");
    }

    // --- delete() ---

    @Test
    void delete_removesApplication_whenOwnedByUser() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        applicationService.delete(1L, 10L);

        verify(applicationRepository).delete(application);
    }

    @Test
    void delete_throwsNotFound_whenNotOwnedByUser() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.delete(999L, 10L))
                .isInstanceOf(ApplicationNotFoundException.class);
    }
}