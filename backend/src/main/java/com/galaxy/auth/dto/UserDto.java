package com.galaxy.auth.dto;

import com.galaxy.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * User DTO
 * Used to return user information without sensitive data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String role; // Primary role
    private Set<String> roles; // All roles

    public static UserDto fromEntity(User user) {
        Set<String> roleNames = user.getRoles().stream()
            .map(role -> role.getName())
            .collect(Collectors.toSet());
        
        // Primary role (highest level)
        String primaryRole = user.getRoles().stream()
            .max((r1, r2) -> Integer.compare(r1.getLevel(), r2.getLevel()))
            .map(role -> role.getName())
            .orElse("USER");
        
        return UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(primaryRole)
            .roles(roleNames)
            .build();
    }
}


