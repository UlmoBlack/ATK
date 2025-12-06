package com.galaxy.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Galaxy Auth Backend - Main Application Class
 * 
 * Spring Boot 3.2+ with Java 17+
 * Features:
 * - JWT-based authentication
 * - HttpOnly cookie support
 * - Role-based access control (RBAC)
 * - Secure password hashing
 * - Rate limiting ready
 */
@SpringBootApplication
@EnableJpaAuditing
public class GalaxyAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(GalaxyAuthApplication.class, args);
    }
}


