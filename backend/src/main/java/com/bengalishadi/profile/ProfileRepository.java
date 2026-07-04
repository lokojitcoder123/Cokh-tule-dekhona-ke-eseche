package com.bengalishadi.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByGender(String gender);
    Optional<Profile> findByEmail(String email);
}
