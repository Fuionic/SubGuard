package com.subguard.controller;

import com.subguard.model.User;
import com.subguard.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if needed
public class SettingsController {

    private final SettingsService settingsService;

    @Autowired
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    // Get current settings
    @GetMapping("/{userId}")
    public Optional<User> getSettings(@PathVariable Long userId) {
        return settingsService.getSettings(userId);
    }

    // Update profile (Name, Notifications)
    @PutMapping("/{userId}")
    public String updateSettings(@PathVariable Long userId, @RequestBody User updatedUser) {
        return settingsService.updateSettings(userId, updatedUser);
    }

    // Wipe all data (Subscriptions and Linked Accounts)
    @DeleteMapping("/wipe-data/{userId}")
    public String wipeData(@PathVariable Long userId) {
        return settingsService.wipeData(userId);
    }
}
