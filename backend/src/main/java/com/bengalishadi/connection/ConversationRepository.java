package com.bengalishadi.connection;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByProfileOneIdOrProfileTwoId(Long profileOneId, Long profileTwoId);
}
