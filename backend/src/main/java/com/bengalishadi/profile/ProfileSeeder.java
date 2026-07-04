package com.bengalishadi.profile;

import com.bengalishadi.auth.Account;
import com.bengalishadi.auth.AccountRepository;
import com.bengalishadi.auth.PasswordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Seeds ~10 demo Bengali profiles on startup if the DB is empty.
 * Mix of Hindu and Muslim Bengali names, varied districts, professions.
 * All demo accounts use password: Password@123
 */
@Component
@Order(1)
public class ProfileSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ProfileSeeder.class);
    private static final String DEMO_PASSWORD = "Password@123";

    private final ProfileRepository profileRepository;
    private final AccountRepository accountRepository;
    private final PasswordService passwordService;

    public ProfileSeeder(ProfileRepository profileRepository,
                         AccountRepository accountRepository,
                         PasswordService passwordService) {
        this.profileRepository = profileRepository;
        this.accountRepository = accountRepository;
        this.passwordService = passwordService;
    }

    @Override
    public void run(String... args) {
        log.info("=== Seeding demo Bengali profiles ===");

        // Female profiles
        seed("Ananya Chatterjee", "Female", 26, 163, "ananya@demo.com",
                "Kolkata", "West Bengal", "Kolkata",
                "Hindu", "Brahmin", "Bengali", "Fluent", "Conversational",
                "M.A. English Literature", "Content Writer", "5-10 LPA",
                "NonVeg", "Never", "Occasionally",
                "Nuclear", "Moderate", "Want children", "Open to discussion",
                "A voracious reader and chai lover. I believe in deep conversations and shared silences. Grew up in the lanes of College Street surrounded by books and adda.",
                "Reading, painting, Rabindra Sangeet, cooking",
                "Build a warm home with someone who values both intellect and emotion",
                "Kind, well-read, respectful of women's independence", "/images/girl1.jpg", false);

        seed("Fatima Khatun", "Female", 24, 157, "fatima@demo.com",
                "Howrah", "West Bengal", "South Bengal",
                "Muslim", null, "Bengali", "Conversational", "Fluent",
                "B.Ed", "School Teacher", "3-5 LPA",
                "NonVeg", "Never", "Never",
                "Joint", "Traditional", "Want children", "Not willing",
                "Born and raised in Howrah. I love teaching children and spending time with family. My mother's biryani is my comfort food.",
                "Teaching, embroidery, gardening, Nazrul Geeti",
                "Serve the community through education while raising a loving family",
                "Devout, family-oriented, kind-hearted, respects elders", "/images/girl2.png", false);

        seed("Priya Sen", "Female", 28, 165, "priya@demo.com",
                "Siliguri", "West Bengal", "North Bengal",
                "Hindu", null, "Bengali", "Fluent", "Fluent",
                "MBA Finance", "Bank Manager", "10-20 LPA",
                "Eggetarian", "Never", "Occasionally",
                "Nuclear", "Liberal", "Open to discussion", "Willing",
                "Career-driven but family-first at heart. I love the mountains of North Bengal and dream of a partner who enjoys both boardrooms and hill treks.",
                "Trekking, finance, photography, travel",
                "Balance a successful career with a fulfilling personal life",
                "Ambitious, supportive, adventurous, good sense of humor", "/images/girl3.jpg", false);

        seed("Rima Das", "Female", 25, 160, "rima@demo.com",
                "Kolkata", "West Bengal", "Kolkata",
                "Hindu", "Kayastha", "Bengali", "Fluent", "Basic",
                "B.Tech Computer Science", "Software Developer", "10-20 LPA",
                "NonVeg", "Never", "Never",
                "Nuclear", "Moderate", "Want children", "Willing",
                "A tech enthusiast who codes by day and watches Bengali films by night. Satyajit Ray is my hero. Looking for someone who appreciates both logic and art.",
                "Coding, Bengali cinema, chess, cooking",
                "Create meaningful technology and build a thoughtful home",
                "Intelligent, emotionally mature, loves Bengali culture", "/images/girl4.png", false);

        seed("Nusrat Jahan", "Female", 27, 162, "nusrat@demo.com",
                "Dhaka", "Dhaka Division", "Bangladeshi-origin",
                "Muslim", null, "Bengali", "Fluent", "Conversational",
                "MBBS", "Doctor", "15-25 LPA",
                "NonVeg", "Never", "Never",
                "Joint", "Moderate", "Want children", "Open to discussion",
                "A doctor by profession and a poet by heart. Born in Dhaka, now settled in Kolkata. I carry two homelands in my heart.",
                "Poetry, medicine, cooking, classical music",
                "Heal people and nurture a loving, compassionate family",
                "Educated, compassionate, respects both cultures", "/images/girl5.png", false);

        seed("Moumita Sen", "Female", 25, 161, "moumita@demo.com",
                "Kolkata", "West Bengal", "Kolkata",
                "Hindu", "Kayastha", "Bengali", "Fluent", "Conversational",
                "B.Sc Animation & Multimedia", "UI/UX Designer", "10-20 LPA",
                "NonVeg", "Never", "Occasionally",
                "Nuclear", "Liberal", "Want children", "Willing",
                "Designer who loves color palettes and typography. Always hunting for the best street food in Kolkata. Believer in travel and photography.",
                "Photography, painting, travel blogging, street food",
                "Design interfaces that make people happy and build a creative partnership in life",
                "Creative, open-minded, career-supportive, enjoys travel", null, false);

        seed("Tania Rahman", "Female", 27, 159, "tania@demo.com",
                "Dhaka", "Dhaka Division", "Bangladeshi-origin",
                "Muslim", null, "Bengali", "Conversational", "Fluent",
                "M.Sc Biotech", "Research Associate", "5-10 LPA",
                "NonVeg", "Never", "Never",
                "Nuclear", "Moderate", "Want children", "Open to discussion",
                "Passionate about science and biology. Enjoy home gardening and making traditional Bangladeshi sweets. Looking for a warm and understanding soul.",
                "Gardening, baking, biology research, classical music",
                "Publish research papers and set up a warm family",
                "Honest, educated, family-centric, values simplicity", null, false);

        // Male profiles
        seed("Arjun Banerjee", "Male", 29, 175, "arjun@demo.com",
                "Kolkata", "West Bengal", "Kolkata",
                "Hindu", "Brahmin", "Bengali", "Fluent", "Fluent",
                "B.Tech + MBA", "Product Manager", "20+ LPA",
                "NonVeg", "Never", "Occasionally",
                "Nuclear", "Moderate", "Want children", "Willing",
                "A Kolkata boy at heart — grew up on fish curry, football, and Feluda. Now building products in tech but still rush home for Durga Pujo every year.",
                "Football, tech, Bengali literature, cooking",
                "Build impactful products and a home filled with laughter",
                "Intelligent, independent, loves Bengali culture", null, false);

        seed("Rahim Sheikh", "Male", 30, 178, "rahim@demo.com",
                "Murshidabad", "West Bengal", "South Bengal",
                "Muslim", null, "Bengali", "Conversational", "Fluent",
                "B.Com + CA", "Chartered Accountant", "15-25 LPA",
                "NonVeg", "Never", "Never",
                "Joint", "Traditional", "Want children", "Not willing",
                "From the historic district of Murshidabad. I value family traditions, honest work, and good food. My weekends are spent with my nieces and nephews.",
                "Cricket, history, family gatherings, cooking",
                "Provide for my family and uphold our values with integrity",
                "Modest, family-loving, kind, good cook", null, false);

        seed("Sourav Ghosh", "Male", 27, 172, "sourav@demo.com",
                "Howrah", "West Bengal", "South Bengal",
                "Hindu", "Sadgop", "Bengali", "Fluent", "Conversational",
                "M.Tech", "Data Scientist", "15-25 LPA",
                "Eggetarian", "Never", "Occasionally",
                "Nuclear", "Liberal", "Open to discussion", "Willing",
                "A data nerd who also writes poetry in Bengali. I believe numbers tell stories just like words do. Looking for someone who can appreciate both.",
                "Data science, poetry, cycling, Rabindra Sangeet",
                "Contribute to AI research while staying rooted in Bengali arts",
                "Creative, curious, values education, emotionally intelligent", null, false);

        seed("Imran Ali", "Male", 26, 170, "imran@demo.com",
                "Kolkata", "West Bengal", "Kolkata",
                "Muslim", null, "Bengali", "Fluent", "Fluent",
                "BFA Fine Arts", "Graphic Designer", "5-10 LPA",
                "NonVeg", "Occasionally", "Never",
                "Nuclear", "Liberal", "Open to discussion", "Willing",
                "An artist from Park Circus. My canvas is my world. I sketch the lanes of Kolkata and dream in colors. Looking for a muse who becomes family.",
                "Painting, design, photography, street food exploration",
                "Have my own design studio and a colorful, warm home",
                "Creative, open-minded, appreciates art, warm-hearted", null, false);

        seed("Debojit Roy", "Male", 31, 180, "debojit@demo.com",
                "Guwahati", "Assam", "NRI Bengali",
                "Hindu", null, "Bengali", "Fluent", "Fluent",
                "MS Computer Science", "Senior Software Engineer", "30+ LPA",
                "NonVeg", "Never", "Occasionally",
                "Nuclear", "Moderate", "Want children", "Willing",
                "Bengali born in Assam, now working in Bangalore. Miss the Brahmaputra and ma's cooking every day. Looking for someone who understands the NRI Bengali heart.",
                "Technology, travel, Bengali food, badminton",
                "Return to the Northeast someday and build something meaningful there",
                "Rooted in culture, career-oriented, kind, family-loving", null, true);

        seed("Prosenjit Dey", "Male", 28, 176, "prosenjit@demo.com",
                "Howrah", "West Bengal", "South Bengal",
                "Hindu", "Kayastha", "Bengali", "Fluent", "Conversational",
                "B.Tech + MS", "Mechanical Engineer", "10-20 LPA",
                "NonVeg", "Never", "Never",
                "Nuclear", "Moderate", "Want children", "Willing",
                "Automotive enthusiast who loves driving, road trips, and retro Hindi music. Deeply attached to my family and hometown.",
                "Road trips, car restoration, retro music, fitness",
                "Travel across India by road and lead a content, balanced family life",
                "Caring, family-focused, independent, enjoys music", null, false);

        seed("Asif Iqbal", "Male", 30, 182, "asif@demo.com",
                "Sylhet", "Sylhet Division", "Bangladeshi-origin",
                "Muslim", null, "Bengali", "Fluent", "Fluent",
                "MBA", "Digital Marketing Lead", "15-25 LPA",
                "NonVeg", "Never", "Never",
                "Nuclear", "Moderate", "Want children", "Willing",
                "Working as a digital marketing professional. I enjoy playing guitar, watching football, and cooking weekends for family.",
                "Playing guitar, football, cooking, digital marketing",
                "Lead marketing campaigns for global brands and build a warm, loving home",
                "Ambitious, communicative, kind, appreciates music", null, false);

        log.info("=== Demo profiles seeded. Login with any email above + password: {} ===", DEMO_PASSWORD);
    }

    private void seed(String name, String gender, int age, int heightCm, String email,
                      String district, String state, String regionOfOrigin,
                      String religion, String subCommunity,
                      String motherTongue, String englishFluency, String hindiFluency,
                      String education, String profession, String income,
                      String diet, String smoking, String drinking,
                      String familyType, String familyValues, String childrenPlans, String relocationWillingness,
                      String about, String interests, String lifeGoals, String partnerExpectations,
                      String profilePicture, boolean horoscopeEnabled) {

        if (profileRepository.findByEmail(email).isPresent()) {
            return;
        }

        Profile p = new Profile();
        p.setName(name); p.setGender(gender); p.setAge(age); p.setHeightCm(heightCm); p.setEmail(email);
        p.setProfilePicture(profilePicture);
        p.setDistrict(district); p.setState(state); p.setRegionOfOrigin(regionOfOrigin);
        p.setReligion(religion); p.setSubCommunity(subCommunity);
        p.setMotherTongue(motherTongue); p.setEnglishFluency(englishFluency); p.setHindiFluency(hindiFluency);
        p.setEducation(education); p.setProfession(profession); p.setIncome(income);
        p.setDiet(diet); p.setSmoking(smoking); p.setDrinking(drinking);
        p.setFamilyType(familyType); p.setFamilyValues(familyValues);
        p.setChildrenPlans(childrenPlans); p.setRelocationWillingness(relocationWillingness);
        p.setAbout(about); p.setInterests(interests); p.setLifeGoals(lifeGoals);
        p.setPartnerExpectations(partnerExpectations);
        p.setHoroscopeMatchingEnabled(horoscopeEnabled);
        p = profileRepository.save(p);

        // Create matching demo account
        String salt = passwordService.generateSalt();
        String hash = passwordService.hashPassword(DEMO_PASSWORD, salt);
        Account account = new Account();
        account.setEmail(email);
        account.setPasswordHash(hash);
        account.setSalt(salt);
        account.setProfileId(p.getId());
        account.setToken(UUID.randomUUID().toString());
        accountRepository.save(account);

        log.info("  Seeded: {} ({}) — {}", name, gender, email);
    }
}
