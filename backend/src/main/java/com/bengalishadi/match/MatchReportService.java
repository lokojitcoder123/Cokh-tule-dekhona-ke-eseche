package com.bengalishadi.match;

import com.bengalishadi.profile.Profile;
import com.bengalishadi.profile.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Orchestrates compatibility scoring and report generation.
 * Computes the rule-based score first, then builds the full report.
 * AI (if used) only narrates the existing report — never determines scores.
 */
@Service
public class MatchReportService {

    private final ProfileRepository profileRepository;
    private final CompatibilityScorer scorer;

    public MatchReportService(ProfileRepository profileRepository, CompatibilityScorer scorer) {
        this.profileRepository = profileRepository;
        this.scorer = scorer;
    }

    /**
     * Generate a full compatibility report between two profiles.
     */
    public MatchReport generateReport(Long profileOneId, Long profileTwoId) {
        Profile one = profileRepository.findById(profileOneId)
                .orElseThrow(() -> new RuntimeException("Profile not found: " + profileOneId));
        Profile two = profileRepository.findById(profileTwoId)
                .orElseThrow(() -> new RuntimeException("Profile not found: " + profileTwoId));

        return generateReport(one, two);
    }

    public MatchReport generateReport(Profile one, Profile two) {
        MatchReport report = new MatchReport();
        report.setProfileOneId(one.getId());
        report.setProfileTwoId(two.getId());

        // Compute dimension scores
        report.setLocationScore(scorer.scoreLocation(one, two));
        report.setReligionScore(scorer.scoreReligion(one, two));
        report.setLifestyleScore(scorer.scoreLifestyle(one, two));
        report.setFamilyScore(scorer.scoreFamily(one, two));
        report.setCareerScore(scorer.scoreCareer(one, two));
        report.setCommunicationScore(scorer.scoreCommunication(one, two));

        // Overall score
        int overall = scorer.computeOverallScore(one, two);
        report.setOverallScore(overall);

        // Build qualitative sections
        report.setStrengths(scorer.buildStrengths(one, two));
        report.setConcerns(scorer.buildConcerns(one, two));
        report.setQuestionsToAsk(scorer.buildQuestions(one, two));

        // Recommendation tier
        if (overall >= 80) {
            report.setRecommendation("Strong Match");
            report.setSummary(String.format("%s and %s show strong compatibility across multiple dimensions. " +
                    "This looks like a very promising match worth pursuing!", one.getName(), two.getName()));
        } else if (overall >= 60) {
            report.setRecommendation("Worth Exploring");
            report.setSummary(String.format("%s and %s have good compatibility in several areas. " +
                    "There are a few differences to discuss, but this match has real potential.", one.getName(), two.getName()));
        } else if (overall >= 40) {
            report.setRecommendation("Needs Discussion");
            report.setSummary(String.format("%s and %s have some differences that would need open conversation. " +
                    "Compatibility isn't just about scores — chemistry and effort matter too.", one.getName(), two.getName()));
        } else {
            report.setRecommendation("Significant Differences");
            report.setSummary(String.format("%s and %s have notable differences in several areas. " +
                    "If you feel a connection, have honest conversations about expectations early.", one.getName(), two.getName()));
        }

        return report;
    }

    /**
     * Quick score for ranking matches (used in list view).
     */
    public int quickScore(Profile a, Profile b) {
        return scorer.computeOverallScore(a, b);
    }
}
