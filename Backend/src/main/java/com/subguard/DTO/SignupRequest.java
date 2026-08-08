package com.subguard.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Signup request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String name;
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
}

