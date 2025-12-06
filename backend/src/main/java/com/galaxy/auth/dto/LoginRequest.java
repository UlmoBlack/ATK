package com.galaxy.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Kullanıcı adı gereklidir")
    @Size(min = 3, max = 30, message = "Kullanıcı adı 3-30 karakter arasında olmalıdır")
    private String username;

    @NotBlank(message = "Şifre gereklidir")
    @Size(min = 8, max = 128, message = "Şifre 8-128 karakter arasında olmalıdır")
    private String password;
}


