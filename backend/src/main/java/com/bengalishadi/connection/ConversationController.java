package com.bengalishadi.connection;

import com.bengalishadi.profile.Profile;
import com.bengalishadi.profile.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ProfileRepository profileRepository;
    private final ChatWebSocketHandler webSocketHandler;

    public ConversationController(ConversationRepository conversationRepository,
                                  ChatMessageRepository messageRepository,
                                  ProfileRepository profileRepository,
                                  ChatWebSocketHandler webSocketHandler) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.profileRepository = profileRepository;
        this.webSocketHandler = webSocketHandler;
    }

    /** GET /api/conversations?profileId=... — list conversations for a user */
    @GetMapping
    public List<Map<String, Object>> list(@RequestParam Long profileId) {
        List<Conversation> convos = conversationRepository
                .findByProfileOneIdOrProfileTwoId(profileId, profileId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Conversation conv : convos) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", conv.getId());
            entry.put("createdAt", conv.getCreatedAt());

            // Get the OTHER participant's profile
            Long otherProfileId = conv.getProfileOneId().equals(profileId)
                    ? conv.getProfileTwoId() : conv.getProfileOneId();
            profileRepository.findById(otherProfileId).ifPresent(p -> {
                entry.put("partnerName", p.getName());
                entry.put("partnerId", p.getId());
                entry.put("partnerReligion", p.getReligion());
                entry.put("partnerDistrict", p.getDistrict());
                entry.put("partnerProfilePicture", p.getProfilePicture());
            });

            // Last message preview
            List<ChatMessage> messages = messageRepository
                    .findByConversationIdOrderBySentAtAsc(conv.getId());
            if (!messages.isEmpty()) {
                ChatMessage last = messages.get(messages.size() - 1);
                entry.put("lastMessage", last.getContent().length() > 50
                        ? last.getContent().substring(0, 50) + "…" : last.getContent());
                entry.put("lastMessageAt", last.getSentAt());
            }

            result.add(entry);
        }
        return result;
    }

    /** GET /api/conversations/{id}/messages?profileId=... — participant check */
    @GetMapping("/{id}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long id,
                                          @RequestParam Long profileId) {
        Conversation conv = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + id));

        if (!conv.isParticipant(profileId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Not a participant in this conversation"));
        }

        return ResponseEntity.ok(messageRepository.findByConversationIdOrderBySentAtAsc(id));
    }

    /** POST /api/conversations/{id}/messages — send a message + broadcast via WebSocket */
    @PostMapping("/{id}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long id,
                                          @RequestBody MessageRequest request) {
        Conversation conv = conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + id));

        if (!conv.isParticipant(request.senderId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Not a participant in this conversation"));
        }

        ChatMessage msg = new ChatMessage();
        msg.setConversationId(id);
        msg.setSenderId(request.senderId());
        msg.setContent(request.content());
        msg = messageRepository.save(msg);

        // Broadcast via WebSocket
        webSocketHandler.broadcast(id, msg);

        return ResponseEntity.ok(msg);
    }

    public record MessageRequest(Long senderId, String content) {}
}
