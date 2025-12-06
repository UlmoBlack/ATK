package com.galaxy.auth.config;

import com.galaxy.auth.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Security Configuration
 * Configures Spring Security with JWT authentication and RBAC
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (using JWT + HttpOnly cookies provides protection)
            .csrf(AbstractHttpConfigurer::disable)
            
            // Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configure authorization
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/auth/login",
                    "/auth/register",
                    "/auth/refresh",
                    "/h2-console/**",
                    "/actuator/health",
                    "/error"
                ).permitAll()
                
                // Allow all OPTIONS requests (CORS preflight)
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                
                // Admin-only endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // Moderator and above
                .requestMatchers("/moderator/**").hasAnyRole("MODERATOR", "ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // Stateless session management (JWT)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Authentication provider
            .authenticationProvider(authenticationProvider())
            
            // Add JWT filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // H2 console configuration (development only)
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
            );
        
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Strength: 12 (higher = more secure but slower)
    }

    // CORS Configuration Source
    private org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        return corsConfig.corsConfigurationSource();
    }
}

