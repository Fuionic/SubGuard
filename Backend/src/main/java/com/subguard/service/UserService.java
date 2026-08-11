package com.subguard.service;

import com.subguard.DTO.LoginRequest;
import com.subguard.DTO.SignupRequest;
import com.subguard.model.User;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final Userrepository userrepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(Userrepository userrepository, PasswordEncoder passwordEncoder) {
        this.userrepository = userrepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String signup(SignupRequest request) {
        String email = request.getEmail();
        Optional<User> existingUser = userrepository.findByEmail(email);
        if(existingUser.isPresent()){
            return "Email already registered";
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // Ensure confirmPassword matches (basic validation)
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userrepository.save(user);
        return String.valueOf(savedUser.getId());
    }

    public String login(LoginRequest request) {
        // Their original UserController checked by email despite LoginRequest having 'username'. 
        // We will try finding by email first as that was the original implementation.
        String identifier = request.getUsername(); 
        String password = request.getPassword();

        if (password == null || password.isBlank()) {
            return "Password is required";
        }

        // Try email first
        Optional<User> userOpt = userrepository.findByEmail(identifier);
        
        // If not found by email, try username
        if (userOpt.isEmpty()) {
            userOpt = userrepository.findByUsername(identifier);
        }

        return userOpt
                .filter(u -> u.getPassword() != null && passwordEncoder.matches(password, u.getPassword()))
                .map(u -> String.valueOf(u.getId()))
                .orElse("Invalid credentials");
    }
}
