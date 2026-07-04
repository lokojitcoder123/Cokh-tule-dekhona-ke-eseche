package com.bengalishadi.connection;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterestRequestRepository extends JpaRepository<InterestRequest, Long> {
    List<InterestRequest> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
    Optional<InterestRequest> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);
}
