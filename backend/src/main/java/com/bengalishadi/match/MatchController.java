package com.bengalishadi.match;

import com.bengalishadi.profile.Profile;
import com.bengalishadi.profile.ProfileRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class MatchController {

    private final ProfileRepository profileRepository;
    private final MatchReportService matchReportService;

    public MatchController(ProfileRepository profileRepository, MatchReportService matchReportService) {
        this.profileRepository = profileRepository;
        this.matchReportService = matchReportService;
    }

    /**
     * GET /api/matches?profileId=...
     * Returns opposite-gender profiles ranked by compatibility score (descending).
     */
    @GetMapping("/matches")
    public List<Map<String, Object>> getMatches(@RequestParam Long profileId) {
        Profile me = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found: " + profileId));

        // Opposite gender matching
        String targetGender = "Male".equalsIgnoreCase(me.getGender()) ? "Female" : "Male";
        List<Profile> candidates = profileRepository.findByGender(targetGender);

        // Score and rank
        List<Map<String, Object>> ranked = new ArrayList<>();
        for (Profile candidate : candidates) {
            if (candidate.getId().equals(me.getId())) continue;
            int score = matchReportService.quickScore(me, candidate);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("profile", candidate);
            entry.put("compatibilityScore", score);
            ranked.add(entry);
        }

        // Sort by score descending
        ranked.sort((a, b) -> (int) b.get("compatibilityScore") - (int) a.get("compatibilityScore"));
        return ranked;
    }

    /**
     * POST /api/match-reports
     * Generate a detailed compatibility report between two profiles.
     */
    @PostMapping("/match-reports")
    public MatchReport generateReport(@RequestBody ReportRequest request) {
        return matchReportService.generateReport(request.profileOneId(), request.profileTwoId());
    }

    public record ReportRequest(Long profileOneId, Long profileTwoId) {}
}
