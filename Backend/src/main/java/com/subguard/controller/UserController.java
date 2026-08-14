package com.subguard.controller;

import com.subguard.DTO.AuthResponse;
import com.subguard.DTO.LoginRequest;
import com.subguard.DTO.SignupRequest;
import com.subguard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request){
        return userService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return userService.login(request);
    }
}
