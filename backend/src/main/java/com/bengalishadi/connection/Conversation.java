package com.bengalishadi.connection;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long profileOneId;

    @Column(nullable = false)
    private Long profileTwoId;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProfileOneId() { return profileOneId; }
    public void setProfileOneId(Long profileOneId) { this.profileOneId = profileOneId; }
    public Long getProfileTwoId() { return profileTwoId; }
    public void setProfileTwoId(Long profileTwoId) { this.profileTwoId = profileTwoId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public boolean isParticipant(Long profileId) {
        return profileOneId.equals(profileId) || profileTwoId.equals(profileId);
    }
}
