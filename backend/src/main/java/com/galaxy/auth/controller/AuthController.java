package com.galaxy.auth.controller;

import com.galaxy.auth.dto.*;
import com.galaxy.auth.service.AuthService;
import com.galaxy.auth.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles login, logout, token refresh, and user info endpoints
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @Value("${jwt.cookie.access-token-name}")
    private String accessTokenCookieName;

    @Value("${jwt.cookie.refresh-token-name}")
    private String refreshTokenCookieName;

    /**
     * POST /auth/login
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletResponse response
    ) {
        log.info("Login attempt for user: {}", request.getUsername());
        
        LoginResponse loginResponse = authService.login(request);
        
        // Set tokens in HttpOnly cookies
        cookieUtil.addAccessTokenCookie(response, loginResponse.getAccessToken());
        cookieUtil.addRefreshTokenCookie(response, loginResponse.getRefreshToken());
        
        // Don't send tokens in response body (they're in cookies)
        loginResponse.setAccessToken(null);
        loginResponse.setRefreshToken(null);
        
        return ResponseEntity.ok(loginResponse);
    }

    /**
     * POST /auth/logout
     * Logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            log.info("Logout request for user: {}", username);
            
            authService.logout(username);
            
            // Clear cookies
            cookieUtil.deleteAccessTokenCookie(response);
            cookieUtil.deleteRefreshTokenCookie(response);
            
            return ResponseEntity.ok(ApiResponse.success("Çıkış başarılı"));
        }
        
        return ResponseEntity.ok(ApiResponse.success("Zaten çıkış yapılmış"));
    }

    /**
     * GET /auth/me
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        log.info("User info request for: {}", username);
        
        UserDto user = authService.getCurrentUser(username);
        return ResponseEntity.ok(user);
    }

    /**
     * POST /auth/refresh
     * Refresh access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
        @CookieValue(name = "${jwt.cookie.refresh-token-name}", required = false) String refreshTokenFromCookie,
        @RequestBody(required = false) RefreshTokenRequest request,
        HttpServletResponse response
    ) {
        log.info("Token refresh request");
        
        // Get refresh token from cookie or request body
        String refreshToken = refreshTokenFromCookie != null 
            ? refreshTokenFromCookie 
            : (request != null ? request.getRefreshToken() : null);
        
        if (refreshToken == null) {
            return ResponseEntity.badRequest()
                .body(LoginResponse.builder()
                    .message("Refresh token bulunamadı")
                    .build());
        }
        
        LoginResponse loginResponse = authService.refreshToken(refreshToken);
        
        // Set new tokens in cookies
        cookieUtil.addAccessTokenCookie(response, loginResponse.getAccessToken());
        cookieUtil.addRefreshTokenCookie(response, loginResponse.getRefreshToken());
        
        // Don't send tokens in response body
        loginResponse.setAccessToken(null);
        loginResponse.setRefreshToken(null);
        
        return ResponseEntity.ok(loginResponse);
    }
}


