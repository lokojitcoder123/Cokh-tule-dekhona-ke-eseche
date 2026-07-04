package com.bengalishadi.profile;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileRepository profileRepository;

    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /** GET /api/profiles — list all, optionally filter by gender */
    @GetMapping
    public List<Profile> list(@RequestParam(required = false) String gender) {
        if (gender != null && !gender.isBlank()) {
            return profileRepository.findByGender(gender);
        }
        return profileRepository.findAll();
    }

    /** GET /api/profiles/{id} */
    @GetMapping("/{id}")
    public Profile getById(@PathVariable Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found: " + id));
    }

    /** POST /api/profiles — create or update */
    @PostMapping
    public Profile createOrUpdate(@RequestBody Profile profile) {
        if (profile.getId() != null) {
            Profile existing = profileRepository.findById(profile.getId())
                    .orElseThrow(() -> new RuntimeException("Profile not found: " + profile.getId()));
            
            // Map editable fields
            existing.setName(profile.getName());
            existing.setGender(profile.getGender());
            existing.setAge(profile.getAge());
            existing.setHeightCm(profile.getHeightCm());
            existing.setEmail(profile.getEmail());
            existing.setProfilePicture(profile.getProfilePicture());
            existing.setDistrict(profile.getDistrict());
            existing.setState(profile.getState());
            existing.setRegionOfOrigin(profile.getRegionOfOrigin());
            existing.setReligion(profile.getReligion());
            existing.setSubCommunity(profile.getSubCommunity());
            existing.setMotherTongue(profile.getMotherTongue());
            existing.setEnglishFluency(profile.getEnglishFluency());
            existing.setHindiFluency(profile.getHindiFluency());
            existing.setEducation(profile.getEducation());
            existing.setProfession(profile.getProfession());
            existing.setIncome(profile.getIncome());
            existing.setDiet(profile.getDiet());
            existing.setSmoking(profile.getSmoking());
            existing.setDrinking(profile.getDrinking());
            existing.setFamilyType(profile.getFamilyType());
            existing.setFamilyValues(profile.getFamilyValues());
            existing.setChildrenPlans(profile.getChildrenPlans());
            existing.setRelocationWillingness(profile.getRelocationWillingness());
            existing.setAbout(profile.getAbout());
            existing.setInterests(profile.getInterests());
            existing.setLifeGoals(profile.getLifeGoals());
            existing.setPartnerExpectations(profile.getPartnerExpectations());
            existing.setHoroscopeMatchingEnabled(profile.getHoroscopeMatchingEnabled());
            
            return profileRepository.save(existing);
        } else {
            return profileRepository.save(profile);
        }
    }
}
