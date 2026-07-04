package com.bengalishadi.match;

import java.util.List;

/**
 * DTO for a full compatibility report between two profiles.
 * The backend computes all scores; AI only narrates, never determines.
 */
public class MatchReport {

    private Long profileOneId;
    private Long profileTwoId;
    private int overallScore;           // 0–100
    private List<String> strengths;     // What's working well
    private List<String> concerns;      // Potential friction points
    private List<String> questionsToAsk; // Suggested conversation starters
    private String recommendation;      // e.g., "Strong Match", "Worth Exploring", "Needs Discussion"
    private String summary;             // Human-readable summary
    private String disclaimer;          // Always present

    // Score breakdown by dimension
    private int locationScore;
    private int religionScore;
    private int lifestyleScore;
    private int familyScore;
    private int careerScore;
    private int communicationScore;

    public MatchReport() {
        this.disclaimer = "This compatibility report is based on profile information and general compatibility factors. " +
                "It is not a guarantee of relationship success. We encourage you to have open, honest conversations " +
                "and take the time to truly know each other. Every relationship is unique.";
    }

    // --- Getters and Setters ---
    public Long getProfileOneId() { return profileOneId; }
    public void setProfileOneId(Long profileOneId) { this.profileOneId = profileOneId; }

    public Long getProfileTwoId() { return profileTwoId; }
    public void setProfileTwoId(Long profileTwoId) { this.profileTwoId = profileTwoId; }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getConcerns() { return concerns; }
    public void setConcerns(List<String> concerns) { this.concerns = concerns; }

    public List<String> getQuestionsToAsk() { return questionsToAsk; }
    public void setQuestionsToAsk(List<String> questionsToAsk) { this.questionsToAsk = questionsToAsk; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public int getLocationScore() { return locationScore; }
    public void setLocationScore(int locationScore) { this.locationScore = locationScore; }

    public int getReligionScore() { return religionScore; }
    public void setReligionScore(int religionScore) { this.religionScore = religionScore; }

    public int getLifestyleScore() { return lifestyleScore; }
    public void setLifestyleScore(int lifestyleScore) { this.lifestyleScore = lifestyleScore; }

    public int getFamilyScore() { return familyScore; }
    public void setFamilyScore(int familyScore) { this.familyScore = familyScore; }

    public int getCareerScore() { return careerScore; }
    public void setCareerScore(int careerScore) { this.careerScore = careerScore; }

    public int getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(int communicationScore) { this.communicationScore = communicationScore; }
}
