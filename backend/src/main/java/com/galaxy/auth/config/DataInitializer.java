package com.galaxy.auth.config;

import com.galaxy.auth.entity.Role;
import com.galaxy.auth.entity.User;
import com.galaxy.auth.repository.RoleRepository;
import com.galaxy.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Data Initializer
 * Creates default roles and admin user on startup
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeRoles();
        initializeAdminUser();
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            log.info("Initializing roles...");
            
            Role guestRole = Role.builder()
                .name("GUEST")
                .description("Guest user")
                .level(0)
                .build();
            
            Role userRole = Role.builder()
                .name("USER")
                .description("Regular user")
                .level(1)
                .build();
            
            Role moderatorRole = Role.builder()
                .name("MODERATOR")
                .description("Moderator user")
                .level(2)
                .build();
            
            Role adminRole = Role.builder()
                .name("ADMIN")
                .description("Administrator")
                .level(3)
                .build();
            
            roleRepository.saveAll(Set.of(guestRole, userRole, moderatorRole, adminRole));
            log.info("Roles initialized successfully");
        }
    }

    private void initializeAdminUser() {
        if (userRepository.count() == 0) {
            log.info("Initializing admin user...");
            
            Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
            
            User admin = User.builder()
                .username("admin")
                .email("admin@galaxy.com")
                .password(passwordEncoder.encode("Admin123!"))
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(Set.of(adminRole))
                .build();
            
            userRepository.save(admin);
            
            log.info("Admin user created - Username: admin, Password: Admin123!");
            
            // Create a test user
            Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found"));
            
            User testUser = User.builder()
                .username("testuser")
                .email("test@galaxy.com")
                .password(passwordEncoder.encode("Test123!"))
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(Set.of(userRole))
                .build();
            
            userRepository.save(testUser);
            
            log.info("Test user created - Username: testuser, Password: Test123!");
        }
    }
}


