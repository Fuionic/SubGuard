package com.subguard.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication response DTO for session-based authentication
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;  // Null for session-based auth
    private String username;
    private String email;
    private String message;
}

