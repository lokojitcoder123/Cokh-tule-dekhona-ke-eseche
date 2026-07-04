package com.bengalishadi.match;

import com.bengalishadi.profile.Profile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Rule-based compatibility scoring engine.
 * Scores across 6 dimensions, each contributing a weighted percentage.
 *
 * SCORING RULES (easy to tune — just adjust weights and thresholds):
 *   Location:       20%  — same district > same state > different (adjusted by relocation)
 *   Religion:        15%  — same religion > different
 *   Lifestyle:      20%  — diet, smoking, drinking alignment
 *   Family:         15%  — family type, children plans, values
 *   Career:         15%  — education/income tier proximity
 *   Communication:  15%  — language fluency overlap
 */
@Service
public class CompatibilityScorer {

    private static final double W_LOCATION = 0.20;
    private static final double W_RELIGION = 0.15;
    private static final double W_LIFESTYLE = 0.20;
    private static final double W_FAMILY = 0.15;
    private static final double W_CAREER = 0.15;
    private static final double W_COMMUNICATION = 0.15;

    /**
     * Compute overall compatibility between two profiles (0–100).
     */
    public int computeOverallScore(Profile a, Profile b) {
        double score =
                W_LOCATION * scoreLocation(a, b) +
                W_RELIGION * scoreReligion(a, b) +
                W_LIFESTYLE * scoreLifestyle(a, b) +
                W_FAMILY * scoreFamily(a, b) +
                W_CAREER * scoreCareer(a, b) +
                W_COMMUNICATION * scoreCommunication(a, b);
        return (int) Math.round(score);
    }

    // --- Location: same district > same state > different + relocation ---
    public int scoreLocation(Profile a, Profile b) {
        if (eq(a.getDistrict(), b.getDistrict())) return 100;
        if (eq(a.getState(), b.getState())) return 70;
        // Different region — check relocation willingness
        boolean aWilling = "Willing".equalsIgnoreCase(a.getRelocationWillingness()) ||
                           "Open to discussion".equalsIgnoreCase(a.getRelocationWillingness());
        boolean bWilling = "Willing".equalsIgnoreCase(b.getRelocationWillingness()) ||
                           "Open to discussion".equalsIgnoreCase(b.getRelocationWillingness());
        if (aWilling && bWilling) return 55;
        if (aWilling || bWilling) return 40;
        return 25;
    }

    // --- Religion: same religion alignment ---
    public int scoreReligion(Profile a, Profile b) {
        if (eq(a.getReligion(), b.getReligion())) {
            // Bonus if same sub-community (when both have specified)
            if (a.getSubCommunity() != null && b.getSubCommunity() != null &&
                eq(a.getSubCommunity(), b.getSubCommunity())) {
                return 100;
            }
            return 90;
        }
        return 40; // Inter-religion — still possible, lower default score
    }

    // --- Lifestyle: diet + smoking + drinking ---
    public int scoreLifestyle(Profile a, Profile b) {
        int score = 0;
        // Diet (40 points): same → 40, partial (eggetarian as middle) → 25, opposite → 10
        if (eq(a.getDiet(), b.getDiet())) {
            score += 40;
        } else if ("Eggetarian".equalsIgnoreCase(a.getDiet()) || "Eggetarian".equalsIgnoreCase(b.getDiet())) {
            score += 25; // Eggetarian is a middle ground in Bengali households
        } else {
            score += 10;
        }
        // Smoking (30 points)
        score += eq(a.getSmoking(), b.getSmoking()) ? 30 : 10;
        // Drinking (30 points)
        score += eq(a.getDrinking(), b.getDrinking()) ? 30 : 10;
        return score;
    }

    // --- Family: family type + children plans + values ---
    public int scoreFamily(Profile a, Profile b) {
        int score = 0;
        // Family type (30 points)
        score += eq(a.getFamilyType(), b.getFamilyType()) ? 30 : 15;
        // Children plans (40 points)
        if (eq(a.getChildrenPlans(), b.getChildrenPlans())) {
            score += 40;
        } else if ("Open to discussion".equalsIgnoreCase(a.getChildrenPlans()) ||
                   "Open to discussion".equalsIgnoreCase(b.getChildrenPlans())) {
            score += 25;
        } else {
            score += 5;
        }
        // Family values (30 points)
        score += eq(a.getFamilyValues(), b.getFamilyValues()) ? 30 : 15;
        return score;
    }

    // --- Career: education/income tier proximity ---
    public int scoreCareer(Profile a, Profile b) {
        int incomeA = incomeTier(a.getIncome());
        int incomeB = incomeTier(b.getIncome());
        int diff = Math.abs(incomeA - incomeB);
        // Same tier → 100, 1 apart → 75, 2 → 50, 3+ → 30
        if (diff == 0) return 100;
        if (diff == 1) return 75;
        if (diff == 2) return 50;
        return 30;
    }

    // --- Communication: language fluency overlap ---
    public int scoreCommunication(Profile a, Profile b) {
        int score = 40; // Bengali is shared by default (mother tongue)

        // English fluency overlap (30 points)
        score += fluencyScore(a.getEnglishFluency(), b.getEnglishFluency(), 30);
        // Hindi fluency overlap (30 points)
        score += fluencyScore(a.getHindiFluency(), b.getHindiFluency(), 30);

        return Math.min(score, 100);
    }

    // --- Build strengths/concerns/questions from score breakdown ---
    public List<String> buildStrengths(Profile a, Profile b) {
        List<String> strengths = new ArrayList<>();
        if (scoreLocation(a, b) >= 70) strengths.add("You're both from the same region — shared cultural roots and easier to meet!");
        if (scoreReligion(a, b) >= 90) strengths.add("Shared religious and community background — smoother family alignment.");
        if (scoreLifestyle(a, b) >= 70) strengths.add("Similar lifestyle choices — from food to habits, you're well-aligned.");
        if (scoreFamily(a, b) >= 70) strengths.add("Your family expectations and values are compatible.");
        if (scoreCareer(a, b) >= 75) strengths.add("Career and financial outlook are well-matched.");
        if (scoreCommunication(a, b) >= 70) strengths.add("Strong language compatibility — communication will be comfortable.");
        if (strengths.isEmpty()) strengths.add("Every match has potential — get to know each other!");
        return strengths;
    }

    public List<String> buildConcerns(Profile a, Profile b) {
        List<String> concerns = new ArrayList<>();
        if (scoreLocation(a, b) < 50) concerns.add("Distance could be a factor — discuss relocation expectations early.");
        if (scoreReligion(a, b) < 60) concerns.add("Different religious backgrounds — discuss family expectations around this.");
        if (scoreLifestyle(a, b) < 50) concerns.add("Lifestyle differences (diet or habits) — talk about daily routines and preferences.");
        if (scoreFamily(a, b) < 50) concerns.add("Different views on family structure or children — have an open conversation.");
        if (scoreCareer(a, b) < 50) concerns.add("Career/income difference — discuss financial expectations and ambitions.");
        return concerns;
    }

    public List<String> buildQuestions(Profile a, Profile b) {
        List<String> questions = new ArrayList<>();
        questions.add("What does a typical weekend look like for you?");
        questions.add("How do you envision your relationship with your in-laws?");
        if (scoreLocation(a, b) < 70) questions.add("Would you be open to relocating? What would make that easier?");
        if (scoreReligion(a, b) < 90) questions.add("How do you both feel about different religious practices at home?");
        if (scoreFamily(a, b) < 70) questions.add("What are your thoughts on having children and how to raise them?");
        questions.add("What role does Bengali culture play in your daily life?");
        return questions;
    }

    // --- Helpers ---

    private boolean eq(String a, String b) {
        if (a == null || b == null) return false;
        return a.trim().equalsIgnoreCase(b.trim());
    }

    /** Maps income strings to numeric tiers for comparison */
    private int incomeTier(String income) {
        if (income == null) return 2;
        return switch (income.toLowerCase().replaceAll("\\s+", "")) {
            case "below3lpa", "0-3lpa" -> 1;
            case "3-5lpa" -> 2;
            case "5-10lpa" -> 3;
            case "10-20lpa" -> 4;
            case "15-25lpa" -> 4;
            case "20+lpa", "25+lpa", "30+lpa" -> 5;
            default -> 2;
        };
    }

    /** Compare fluency levels and return a proportional score */
    private int fluencyScore(String fluencyA, String fluencyB, int maxPoints) {
        int levelA = fluencyLevel(fluencyA);
        int levelB = fluencyLevel(fluencyB);
        int minLevel = Math.min(levelA, levelB);
        // Both fluent → full points, both basic → half, etc.
        return (int) (maxPoints * (minLevel / 3.0));
    }

    private int fluencyLevel(String fluency) {
        if (fluency == null) return 0;
        return switch (fluency.toLowerCase()) {
            case "fluent" -> 3;
            case "conversational" -> 2;
            case "basic" -> 1;
            default -> 0;
        };
    }
}
