package com.subguard.service;

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

    public String signup(User user) {
        String email = user.getEmail();
        Optional<User> existingUser = userrepository.findByEmail(email);
        if(existingUser.isPresent()){
            return "Email already registered";
        }

        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userrepository.save(user);
        return String.valueOf(savedUser.getId());
    }

    public String login(User user) {
        String email = user.getEmail();
        String password = user.getPassword();

        if (password == null || password.isBlank()) {
            return "Password is required";
        }

        return userrepository.findByEmail(email)
                .filter(u -> u.getPassword() != null && passwordEncoder.matches(password, u.getPassword()))
                .map(u -> String.valueOf(u.getId()))
                .orElse("Invalid credentials");
    }
}
