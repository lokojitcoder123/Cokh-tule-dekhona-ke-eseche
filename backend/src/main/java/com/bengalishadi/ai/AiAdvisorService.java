package com.bengalishadi.ai;

import com.bengalishadi.match.MatchReport;
import com.bengalishadi.match.MatchReportService;
import com.bengalishadi.profile.Profile;
import com.bengalishadi.profile.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * AI Advisor service — builds culturally-aware prompts for Gemini.
 * IMPORTANT: AI only narrates/explains the backend-computed score.
 * It never determines compatibility independently.
 */
@Service
public class AiAdvisorService {

    private static final Logger log = LoggerFactory.getLogger(AiAdvisorService.class);

    private final GeminiClient geminiClient;
    private final ProfileRepository profileRepository;
    private final MatchReportService matchReportService;

    private static final String FALLBACK_MESSAGE =
            "I appreciate your question! While I'm unable to provide a detailed analysis right now, " +
            "I'd encourage you to look at the compatibility report above and have open, honest conversations " +
            "with your potential match. Every good relationship starts with genuine communication. " +
            "Feel free to ask me again later!";

    public AiAdvisorService(GeminiClient geminiClient,
                            ProfileRepository profileRepository,
                            MatchReportService matchReportService) {
        this.geminiClient = geminiClient;
        this.profileRepository = profileRepository;
        this.matchReportService = matchReportService;
    }

    /**
     * Chat with the AI advisor about a specific match.
     * @param profileOneId First profile
     * @param profileTwoId Second profile
     * @param userMessage  The user's question
     * @return AI advisor response (or fallback on failure)
     */
    public String chat(Long profileOneId, Long profileTwoId, String userMessage) {
        try {
            Profile one = profileRepository.findById(profileOneId)
                    .orElseThrow(() -> new RuntimeException("Profile not found: " + profileOneId));
            Profile two = profileRepository.findById(profileTwoId)
                    .orElseThrow(() -> new RuntimeException("Profile not found: " + profileTwoId));

            // Compute compatibility report first — AI grounds its response in this
            MatchReport report = matchReportService.generateReport(one, two);

            String prompt = buildPrompt(one, two, report, userMessage);
            return geminiClient.generate(prompt);
        } catch (Exception e) {
            log.error("AI advisor failed, returning fallback", e);
            return FALLBACK_MESSAGE + " (Error details: " + e.getMessage() + ")";
        }
    }

    private String buildPrompt(Profile one, Profile two, MatchReport report, String userMessage) {
        return """
                You are a warm, respectful, and culturally aware marriage advisor for Bengali Shadi, 
                a matrimony platform for the Bengali community. Your role is to help users understand 
                their compatibility and make informed decisions about their matches.
                
                IMPORTANT GUIDELINES:
                - Be warm, respectful, direct, and culturally aware of Bengali family/marriage norms
                - Never promise marriage success or make guarantees
                - Answer general questions naturally, not just compatibility questions
                - Ground ALL compatibility answers in the backend-calculated report below — do NOT invent new scores
                - Suggest concrete discussion topics and next steps
                - Be sensitive to religious and community differences
                - Use a tone like a trusted elder advisor (মামা/মাসি giving advice)
                
                === PROFILE ONE ===
                Name: %s | Age: %s | Gender: %s
                Location: %s, %s | Region: %s
                Religion: %s | Community: %s
                Education: %s | Profession: %s | Income: %s
                Diet: %s | Smoking: %s | Drinking: %s
                Family: %s (%s) | Children: %s | Relocate: %s
                About: %s
                Interests: %s
                Partner Expectations: %s
                
                === PROFILE TWO ===
                Name: %s | Age: %s | Gender: %s
                Location: %s, %s | Region: %s
                Religion: %s | Community: %s
                Education: %s | Profession: %s | Income: %s
                Diet: %s | Smoking: %s | Drinking: %s
                Family: %s (%s) | Children: %s | Relocate: %s
                About: %s
                Interests: %s
                Partner Expectations: %s
                
                === COMPATIBILITY REPORT (computed by our system, not by you) ===
                Overall Score: %d/100
                Recommendation: %s
                Summary: %s
                Strengths: %s
                Concerns: %s
                Suggested Questions: %s
                
                Score Breakdown:
                - Location: %d/100
                - Religion: %d/100
                - Lifestyle: %d/100
                - Family: %d/100
                - Career: %d/100
                - Communication: %d/100
                
                === USER'S QUESTION ===
                %s
                
                Please respond helpfully. Keep your response concise (2-4 paragraphs max).
                """.formatted(
                one.getName(), one.getAge(), one.getGender(),
                one.getDistrict(), one.getState(), one.getRegionOfOrigin(),
                one.getReligion(), one.getSubCommunity(),
                one.getEducation(), one.getProfession(), one.getIncome(),
                one.getDiet(), one.getSmoking(), one.getDrinking(),
                one.getFamilyType(), one.getFamilyValues(), one.getChildrenPlans(), one.getRelocationWillingness(),
                one.getAbout(), one.getInterests(), one.getPartnerExpectations(),

                two.getName(), two.getAge(), two.getGender(),
                two.getDistrict(), two.getState(), two.getRegionOfOrigin(),
                two.getReligion(), two.getSubCommunity(),
                two.getEducation(), two.getProfession(), two.getIncome(),
                two.getDiet(), two.getSmoking(), two.getDrinking(),
                two.getFamilyType(), two.getFamilyValues(), two.getChildrenPlans(), two.getRelocationWillingness(),
                two.getAbout(), two.getInterests(), two.getPartnerExpectations(),

                report.getOverallScore(), report.getRecommendation(), report.getSummary(),
                String.join("; ", report.getStrengths()),
                String.join("; ", report.getConcerns()),
                String.join("; ", report.getQuestionsToAsk()),
                report.getLocationScore(), report.getReligionScore(), report.getLifestyleScore(),
                report.getFamilyScore(), report.getCareerScore(), report.getCommunicationScore(),

                userMessage
        );
    }
}
