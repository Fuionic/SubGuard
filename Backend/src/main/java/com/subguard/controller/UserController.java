package com.subguard.controller;

import com.subguard.model.User;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private Userrepository userrepository;

    // Signup
    @PostMapping("/signup")
    public String signup(@RequestBody User user){
        String email = user.getEmail();
        Optional<User> existingUser = userrepository.findByEmail(email);
        if(existingUser.isPresent()){
            return "Email already registered";
        }

        user.setEmail(email);
        User savedUser = userrepository.save(user);
        return String.valueOf(savedUser.getId());
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user){
        String email = user.getEmail();
        String password = user.getPassword();

        if (password == null || password.isBlank()) {
            return "Password is required";
        }

        return userrepository.findByEmail(email)
                .filter(u -> u.getPassword() != null && u.getPassword().equals(password))
                .map(u -> String.valueOf(u.getId()))
                .orElse("Invalid credentials");
    }
}
