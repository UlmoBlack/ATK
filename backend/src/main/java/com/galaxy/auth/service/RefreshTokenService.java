package com.galaxy.auth.service;

import com.galaxy.auth.entity.RefreshToken;
import com.galaxy.auth.entity.User;
import com.galaxy.auth.repository.RefreshTokenRepository;
import com.galaxy.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Refresh Token Service
 * Manages refresh token lifecycle
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Create and save refresh token
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Revoke existing tokens
        refreshTokenRepository.revokeAllUserTokens(user);
        
        // Generate new token
        String tokenString = jwtTokenProvider.generateRefreshToken(user);
        
        RefreshToken refreshToken = RefreshToken.builder()
            .token(tokenString)
            .user(user)
            .expiresAt(LocalDateTime.now().plus(Duration.ofMillis(jwtTokenProvider.getRefreshTokenExpiration())))
            .revoked(false)
            .build();
        
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Find refresh token by token string
     */
    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Validate refresh token
     */
    @Transactional(readOnly = true)
    public boolean validateRefreshToken(RefreshToken token) {
        return token.isValid() && jwtTokenProvider.validateToken(token.getToken());
    }

    /**
     * Revoke refresh token
     */
    @Transactional
    public void revokeToken(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }

    /**
     * Revoke all user tokens
     */
    @Transactional
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllUserTokens(user);
    }

    /**
     * Clean up expired tokens (runs daily)
     */
    @Scheduled(cron = "0 0 2 * * ?") // 2 AM daily
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Cleaning up expired refresh tokens...");
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}

