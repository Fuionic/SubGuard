package com.subguard.service;

import com.subguard.DTO.AuthResponse;
import com.subguard.DTO.LoginRequest;
import com.subguard.DTO.SignupRequest;
import com.subguard.Util.JwtUtil;
import com.subguard.errorhandling.DuplicateUserException;
import com.subguard.errorhandling.InvalidCredentialsException;
import com.subguard.errorhandling.SignupException;
import com.subguard.errorhandling.UserLoginException;
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
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(Userrepository userrepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userrepository = userrepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse signup(SignupRequest request) {
        String email = request.getEmail();
        Optional<User> existingUser = userrepository.findByEmail(email);
        if(existingUser.isPresent()){
            throw new DuplicateUserException("Email already registered");
        }

        User user = new User();
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setName(request.getUsername());
        } else {
            user.setName(request.getName());
        }
        user.setEmail(request.getEmail());
        
        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new SignupException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userrepository.save(user);
        
        String token = jwtUtil.generateToken(savedUser.getUsername());
        return new AuthResponse(token, savedUser.getId(), "Success");
    }

    public AuthResponse login(LoginRequest request) {
      
        String identifier = request.getUsername(); 
        String password = request.getPassword();

        if (password == null || password.isBlank()) {
            throw new InvalidCredentialsException("Password is required");
        }

        Optional<User> userOpt = userrepository.findByEmail(identifier);

        if (userOpt.isEmpty()) {
            userOpt = userrepository.findByUsername(identifier);
        }

        return userOpt
                .filter(u -> u.getPassword() != null && passwordEncoder.matches(password, u.getPassword()))
                .map(u -> {
                    String token = jwtUtil.generateToken(u.getUsername());
                    return new AuthResponse(token, u.getId(), "Success");
                })
                .orElseThrow(() -> new UserLoginException("Invalid credentials"));
    }
}
