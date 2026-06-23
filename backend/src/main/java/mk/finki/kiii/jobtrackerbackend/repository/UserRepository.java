package mk.finki.kiii.jobtrackerbackend.repository;

import mk.finki.kiii.jobtrackerbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}