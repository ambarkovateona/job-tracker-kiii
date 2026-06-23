package mk.finki.kiii.jobtrackerbackend.repository;

import mk.finki.kiii.jobtrackerbackend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
}