package com.galaxy.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Cookie Utility
 * Handles HttpOnly cookie creation and deletion
 */
@Component
public class CookieUtil {

    @Value("${jwt.cookie.access-token-name}")
    private String accessTokenCookieName;

    @Value("${jwt.cookie.refresh-token-name}")
    private String refreshTokenCookieName;

    @Value("${jwt.cookie.http-only}")
    private boolean httpOnly;

    @Value("${jwt.cookie.secure}")
    private boolean secure;

    @Value("${jwt.cookie.same-site}")
    private String sameSite;

    @Value("${jwt.cookie.domain}")
    private String domain;

    @Value("${jwt.cookie.path}")
    private String path;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    /**
     * Add access token cookie
     */
    public void addAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = createCookie(
            accessTokenCookieName,
            token,
            (int) (accessTokenExpiration / 1000) // Convert to seconds
        );
        response.addCookie(cookie);
    }

    /**
     * Add refresh token cookie
     */
    public void addRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = createCookie(
            refreshTokenCookieName,
            token,
            (int) (refreshTokenExpiration / 1000) // Convert to seconds
        );
        response.addCookie(cookie);
    }

    /**
     * Delete access token cookie
     */
    public void deleteAccessTokenCookie(HttpServletResponse response) {
        Cookie cookie = createCookie(accessTokenCookieName, "", 0);
        response.addCookie(cookie);
    }

    /**
     * Delete refresh token cookie
     */
    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = createCookie(refreshTokenCookieName, "", 0);
        response.addCookie(cookie);
    }

    /**
     * Create cookie with security settings
     */
    private Cookie createCookie(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(httpOnly);
        cookie.setSecure(secure);
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);
        
        // Domain setting (only for production with actual domain)
        if (!"localhost".equals(domain)) {
            cookie.setDomain(domain);
        }
        
        // Note: SameSite is not directly supported in Cookie class
        // It needs to be set via response header
        // This is a limitation; for production, consider using ResponseCookie from Spring 5+
        
        return cookie;
    }
}


