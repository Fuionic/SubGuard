package com.subguard.controller;

import com.subguard.DTO.UserDTO;
import com.subguard.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Optional<UserDTO>> getSettings(@PathVariable Long userId) {
        Optional<UserDTO> settings = settingsService.getSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateSettings(@PathVariable Long userId, @RequestBody UserDTO updatedUser) {
        String result = settingsService.updateSettings(userId, updatedUser);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/wipe-data/{userId}")
    public ResponseEntity<String> wipeData(@PathVariable Long userId) {
        String result = settingsService.wipeData(userId);
        return ResponseEntity.ok(result);
    }
}
