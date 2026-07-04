package com.bengalishadi.profile;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Profile entity with Bengali-specific fields.
 * Covers demographics, religion/community, lifestyle, family, career,
 * and partner expectations relevant to the Bengali matrimony context.
 */
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Basic ---
    private String name;
    private String gender;       // "Male" or "Female"
    private Integer age;
    private Integer heightCm;
    private String email;

    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    // --- Location ---
    private String district;     // e.g., "Kolkata", "Howrah", "Siliguri"
    private String state;        // e.g., "West Bengal", "Assam"
    private String regionOfOrigin; // "Kolkata", "North Bengal", "South Bengal", "Bangladeshi-origin", "NRI Bengali"

    // --- Religion & Community ---
    private String religion;     // "Hindu", "Muslim", "Christian", "Other"
    private String subCommunity; // Optional — e.g., Bengali Hindu caste groups

    // --- Language ---
    private String motherTongue;       // Default: "Bengali"
    private String englishFluency;     // "Fluent", "Conversational", "Basic", "None"
    private String hindiFluency;       // "Fluent", "Conversational", "Basic", "None"

    // --- Education & Career ---
    private String education;    // e.g., "B.Tech", "MBA", "MBBS", "BA"
    private String profession;   // e.g., "Software Engineer", "Doctor", "Teacher"
    private String income;       // e.g., "5-10 LPA", "10-20 LPA", "20+ LPA"

    // --- Lifestyle ---
    private String diet;         // "Veg", "NonVeg", "Eggetarian"
    private String smoking;      // "Never", "Occasionally", "Regularly"
    private String drinking;     // "Never", "Occasionally", "Regularly"

    // --- Family ---
    private String familyType;   // "Joint", "Nuclear"
    private String familyValues; // "Traditional", "Moderate", "Liberal"
    private String childrenPlans;      // "Want children", "Don't want", "Open to discussion"
    private String relocationWillingness; // "Willing", "Not willing", "Open to discussion"

    // --- About / Preferences ---
    @Column(length = 2000)
    private String about;
    @Column(length = 1000)
    private String interests;
    @Column(length = 1000)
    private String lifeGoals;
    @Column(length = 1000)
    private String partnerExpectations;

    // --- Optional ---
    private Boolean horoscopeMatchingEnabled; // Optional toggle for Hindu users

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (motherTongue == null) motherTongue = "Bengali";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Integer getHeightCm() { return heightCm; }
    public void setHeightCm(Integer heightCm) { this.heightCm = heightCm; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getRegionOfOrigin() { return regionOfOrigin; }
    public void setRegionOfOrigin(String regionOfOrigin) { this.regionOfOrigin = regionOfOrigin; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getSubCommunity() { return subCommunity; }
    public void setSubCommunity(String subCommunity) { this.subCommunity = subCommunity; }

    public String getMotherTongue() { return motherTongue; }
    public void setMotherTongue(String motherTongue) { this.motherTongue = motherTongue; }

    public String getEnglishFluency() { return englishFluency; }
    public void setEnglishFluency(String englishFluency) { this.englishFluency = englishFluency; }

    public String getHindiFluency() { return hindiFluency; }
    public void setHindiFluency(String hindiFluency) { this.hindiFluency = hindiFluency; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getIncome() { return income; }
    public void setIncome(String income) { this.income = income; }

    public String getDiet() { return diet; }
    public void setDiet(String diet) { this.diet = diet; }

    public String getSmoking() { return smoking; }
    public void setSmoking(String smoking) { this.smoking = smoking; }

    public String getDrinking() { return drinking; }
    public void setDrinking(String drinking) { this.drinking = drinking; }

    public String getFamilyType() { return familyType; }
    public void setFamilyType(String familyType) { this.familyType = familyType; }

    public String getFamilyValues() { return familyValues; }
    public void setFamilyValues(String familyValues) { this.familyValues = familyValues; }

    public String getChildrenPlans() { return childrenPlans; }
    public void setChildrenPlans(String childrenPlans) { this.childrenPlans = childrenPlans; }

    public String getRelocationWillingness() { return relocationWillingness; }
    public void setRelocationWillingness(String relocationWillingness) { this.relocationWillingness = relocationWillingness; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getLifeGoals() { return lifeGoals; }
    public void setLifeGoals(String lifeGoals) { this.lifeGoals = lifeGoals; }

    public String getPartnerExpectations() { return partnerExpectations; }
    public void setPartnerExpectations(String partnerExpectations) { this.partnerExpectations = partnerExpectations; }

    public Boolean getHoroscopeMatchingEnabled() { return horoscopeMatchingEnabled; }
    public void setHoroscopeMatchingEnabled(Boolean horoscopeMatchingEnabled) { this.horoscopeMatchingEnabled = horoscopeMatchingEnabled; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
