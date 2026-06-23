package mk.finki.kiii.jobtrackerbackend.repository;

import mk.finki.kiii.jobtrackerbackend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByNameIgnoreCase(String name);
}