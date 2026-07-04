package com.bengalishadi.auth;

import com.bengalishadi.profile.Profile;
import com.bengalishadi.profile.ProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accountRepository;
    private final ProfileRepository profileRepository;
    private final PasswordService passwordService;

    public AuthController(AccountRepository accountRepository,
                          ProfileRepository profileRepository,
                          PasswordService passwordService) {
        this.accountRepository = accountRepository;
        this.profileRepository = profileRepository;
        this.passwordService = passwordService;
    }

    /**
     * POST /api/auth/signup
     * Creates a new account + blank profile, returns token + profileId.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (accountRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        // Create profile first
        Profile profile = new Profile();
        profile.setName(request.name());
        profile.setGender(request.gender());
        profile.setEmail(request.email());
        profile = profileRepository.save(profile);

        // Create account
        String salt = passwordService.generateSalt();
        String hash = passwordService.hashPassword(request.password(), salt);
        String token = UUID.randomUUID().toString();

        Account account = new Account();
        account.setEmail(request.email());
        account.setPasswordHash(hash);
        account.setSalt(salt);
        account.setProfileId(profile.getId());
        account.setToken(token);
        accountRepository.save(account);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "profileId", profile.getId(),
                "name", profile.getName()
        ));
    }

    /**
     * POST /api/auth/login
     * Validates credentials, generates new token, returns token + profileId.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return accountRepository.findByEmail(request.email())
                .map(account -> {
                    if (!passwordService.verifyPassword(request.password(), account.getSalt(), account.getPasswordHash())) {
                        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
                    }
                    // Generate fresh token on each login
                    String token = UUID.randomUUID().toString();
                    account.setToken(token);
                    accountRepository.save(account);

                    String name = "";
                    if (account.getProfileId() != null) {
                        name = profileRepository.findById(account.getProfileId())
                                .map(Profile::getName).orElse("");
                    }

                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "profileId", account.getProfileId(),
                            "name", name
                    ));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    // --- Request DTOs ---
    public record SignupRequest(String name, String email, String password, String gender) {}
    public record LoginRequest(String email, String password) {}
}
