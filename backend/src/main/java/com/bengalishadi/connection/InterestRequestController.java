package com.bengalishadi.connection;

import com.bengalishadi.profile.Profile;
import com.bengalishadi.profile.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class InterestRequestController {

    private final InterestRequestRepository requestRepository;
    private final ConversationRepository conversationRepository;
    private final ProfileRepository profileRepository;

    public InterestRequestController(InterestRequestRepository requestRepository,
                                     ConversationRepository conversationRepository,
                                     ProfileRepository profileRepository) {
        this.requestRepository = requestRepository;
        this.conversationRepository = conversationRepository;
        this.profileRepository = profileRepository;
    }

    /** GET /api/interest-requests?profileId=...&box=all */
    @GetMapping("/interest-requests")
    public List<Map<String, Object>> list(@RequestParam Long profileId,
                                           @RequestParam(defaultValue = "all") String box) {
        List<InterestRequest> requests = requestRepository.findBySenderIdOrReceiverId(profileId, profileId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (InterestRequest req : requests) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", req.getId());
            entry.put("senderId", req.getSenderId());
            entry.put("receiverId", req.getReceiverId());
            entry.put("status", req.getStatus());
            entry.put("createdAt", req.getCreatedAt());
            entry.put("direction", req.getSenderId().equals(profileId) ? "sent" : "received");

            // Include other person's profile info
            Long otherProfileId = req.getSenderId().equals(profileId) ? req.getReceiverId() : req.getSenderId();
            profileRepository.findById(otherProfileId).ifPresent(p -> {
                Map<String, Object> otherMap = new HashMap<>();
                otherMap.put("id", p.getId());
                otherMap.put("name", p.getName());
                otherMap.put("age", p.getAge() != null ? p.getAge() : 0);
                otherMap.put("district", p.getDistrict() != null ? p.getDistrict() : "");
                otherMap.put("religion", p.getReligion() != null ? p.getReligion() : "");
                otherMap.put("profession", p.getProfession() != null ? p.getProfession() : "");
                otherMap.put("about", p.getAbout() != null ? p.getAbout() : "");
                otherMap.put("profilePicture", p.getProfilePicture());
                entry.put("otherProfile", otherMap);
            });

            result.add(entry);
        }
        return result;
    }

    /** POST /api/interest-requests — send interest */
    @PostMapping("/interest-requests")
    public ResponseEntity<?> send(@RequestBody SendRequest request) {
        // Guard: no self-request
        if (request.senderId().equals(request.receiverId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot send interest to yourself"));
        }
        // Guard: no duplicate
        if (requestRepository.existsBySenderIdAndReceiverId(request.senderId(), request.receiverId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Interest already sent"));
        }
        // Also check reverse direction
        if (requestRepository.existsBySenderIdAndReceiverId(request.receiverId(), request.senderId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "This person has already sent you an interest request"));
        }

        InterestRequest ir = new InterestRequest();
        ir.setSenderId(request.senderId());
        ir.setReceiverId(request.receiverId());
        ir.setStatus("PENDING");
        ir = requestRepository.save(ir);
        return ResponseEntity.ok(ir);
    }

    /** POST /api/interest-requests/{id}/accept — creates a Conversation */
    @PostMapping("/interest-requests/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Long id) {
        InterestRequest ir = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        if (!"PENDING".equals(ir.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Request already " + ir.getStatus().toLowerCase()));
        }

        ir.setStatus("ACCEPTED");
        requestRepository.save(ir);

        // Create conversation
        Conversation conv = new Conversation();
        conv.setProfileOneId(ir.getSenderId());
        conv.setProfileTwoId(ir.getReceiverId());
        conv = conversationRepository.save(conv);

        return ResponseEntity.ok(Map.of(
                "message", "Interest accepted! You can now chat.",
                "conversationId", conv.getId()
        ));
    }

    /** POST /api/interest-requests/{id}/decline */
    @PostMapping("/interest-requests/{id}/decline")
    public ResponseEntity<?> decline(@PathVariable Long id) {
        InterestRequest ir = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        if (!"PENDING".equals(ir.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Request already " + ir.getStatus().toLowerCase()));
        }

        ir.setStatus("DECLINED");
        requestRepository.save(ir);
        return ResponseEntity.ok(Map.of("message", "Interest declined."));
    }

    public record SendRequest(Long senderId, Long receiverId) {}
}
