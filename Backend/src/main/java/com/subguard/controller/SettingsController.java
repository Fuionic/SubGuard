package com.subguard.controller;

import com.subguard.DTO.UserDTO;
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

    @GetMapping("/{userId}")
    public Optional<UserDTO> getSettings(@PathVariable Long userId) {
        return settingsService.getSettings(userId);
    }

    @PutMapping("/{userId}")
    public String updateSettings(@PathVariable Long userId, @RequestBody UserDTO updatedUser) {
        return settingsService.updateSettings(userId, updatedUser);
    }

    @DeleteMapping("/wipe-data/{userId}")
    public String wipeData(@PathVariable Long userId) {
        return settingsService.wipeData(userId);
    }
}
