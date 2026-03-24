package com.subguard.controller;

import com.subguard.model.User;
import com.subguard.repository.LinkedAccountRepository;
import com.subguard.repository.SubscriptionRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if needed
public class SettingsController {

    @Autowired
    private Userrepository userrepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private LinkedAccountRepository linkedAccountRepository;

    // Get current settings
    @GetMapping("/{userId}")
    public Optional<User> getSettings(@PathVariable Long userId) {
        return userrepository.findById(userId);
    }

    // Update profile (Name, Notifications)
    @PutMapping("/{userId}")
    public String updateSettings(@PathVariable Long userId, @RequestBody User updatedUser) {
        return userrepository.findById(userId).map(user -> {
            user.setName(updatedUser.getName());
            user.setNotificationsEnabled(updatedUser.isNotificationsEnabled());
            user.setNotificationEmail(updatedUser.getNotificationEmail());
            userrepository.save(user);
            return "Settings updated successfully";
        }).orElse("User not found");
    }

    // Wipe all data (Subscriptions and Linked Accounts)
    @DeleteMapping("/wipe-data/{userId}")
    @Transactional
    public String wipeData(@PathVariable Long userId) {
        return userrepository.findById(userId).map(user -> {
            subscriptionRepository.deleteByUser(user);
            linkedAccountRepository.deleteByUser(user);
            return "All data wiped successfully";
        }).orElse("User not found");
    }
}
