package com.galaxy.auth.service;

import com.galaxy.auth.dto.LoginRequest;
import com.galaxy.auth.dto.LoginResponse;
import com.galaxy.auth.dto.UserDto;
import com.galaxy.auth.entity.RefreshToken;
import com.galaxy.auth.entity.User;
import com.galaxy.auth.exception.InvalidTokenException;
import com.galaxy.auth.repository.UserRepository;
import com.galaxy.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication Service
 * Handles login, logout, token refresh
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    /**
     * Login user
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Kullanıcı adı veya şifre hatalı"));

        // Check if account is locked
        if (!user.isAccountNonLocked()) {
            throw new LockedException("Hesap kilitlendi. Lütfen " + LOCKOUT_DURATION_MINUTES + " dakika sonra tekrar deneyin.");
        }

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

            // Reset failed attempts on successful login
            user.resetFailedLoginAttempts();
            userRepository.save(user);

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            log.info("User logged in successfully: {}", user.getUsername());

            return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(UserDto.fromEntity(user))
                .message("Giriş başarılı")
                .build();

        } catch (AuthenticationException e) {
            // Increment failed attempts
            user.incrementFailedLoginAttempts();
            
            if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.lockAccount(LOCKOUT_DURATION_MINUTES);
                userRepository.save(user);
                throw new LockedException("Çok fazla başarısız deneme. Hesap " + LOCKOUT_DURATION_MINUTES + " dakika kilitlendi.");
            }
            
            userRepository.save(user);
            
            int remainingAttempts = MAX_FAILED_ATTEMPTS - user.getFailedLoginAttempts();
            throw new BadCredentialsException(
                "Kullanıcı adı veya şifre hatalı. Kalan deneme hakkı: " + remainingAttempts
            );
        }
    }

    /**
     * Refresh access token
     */
    @Transactional
    public LoginResponse refreshToken(String refreshTokenString) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenString)
            .orElseThrow(() -> new InvalidTokenException("Geçersiz refresh token"));

        if (!refreshTokenService.validateRefreshToken(refreshToken)) {
            throw new InvalidTokenException("Refresh token geçersiz veya süresi dolmuş");
        }

        User user = refreshToken.getUser();

        // Generate new access token
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        
        // Optionally, rotate refresh token (best practice)
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        log.info("Token refreshed for user: {}", user.getUsername());

        return LoginResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken.getToken())
            .user(UserDto.fromEntity(user))
            .message("Token yenilendi")
            .build();
    }

    /**
     * Logout user
     */
    @Transactional
    public void logout(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new BadCredentialsException("Kullanıcı bulunamadı"));

        // Revoke all refresh tokens
        refreshTokenService.revokeAllUserTokens(user);

        log.info("User logged out: {}", username);
    }

    /**
     * Get current user info
     */
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsernameWithRoles(username)
            .orElseThrow(() -> new BadCredentialsException("Kullanıcı bulunamadı"));

        return UserDto.fromEntity(user);
    }
}


