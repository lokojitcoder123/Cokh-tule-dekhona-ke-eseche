package com.bengalishadi.ai;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiAdvisorService advisorService;

    public AiController(AiAdvisorService advisorService) {
        this.advisorService = advisorService;
    }

    /** POST /api/ai/chat — ask the AI advisor about a match */
    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody ChatRequest request) {
        String response = advisorService.chat(
                request.profileOneId(), request.profileTwoId(), request.message());
        return Map.of("response", response);
    }

    public record ChatRequest(Long profileOneId, Long profileTwoId, String message) {}
}
