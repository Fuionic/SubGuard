package com.subguard.service;

import com.subguard.model.User;
import com.subguard.repository.LinkedAccountRepository;
import com.subguard.repository.SubscriptionRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SettingsService {

    private final Userrepository userrepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LinkedAccountRepository linkedAccountRepository;

    @Autowired
    public SettingsService(Userrepository userrepository,
                           SubscriptionRepository subscriptionRepository,
                           LinkedAccountRepository linkedAccountRepository) {
        this.userrepository = userrepository;
        this.subscriptionRepository = subscriptionRepository;
        this.linkedAccountRepository = linkedAccountRepository;
    }

    public Optional<User> getSettings(Long userId) {
        return userrepository.findById(userId);
    }

    public String updateSettings(Long userId, User updatedUser) {
        return userrepository.findById(userId).map(user -> {
            user.setName(updatedUser.getName());
            user.setNotificationsEnabled(updatedUser.isNotificationsEnabled());
            user.setNotificationEmail(updatedUser.getNotificationEmail());
            userrepository.save(user);
            return "Settings updated successfully";
        }).orElse("User not found");
    }

    @Transactional
    public String wipeData(Long userId) {
        return userrepository.findById(userId).map(user -> {
            subscriptionRepository.deleteByUser(user);
            linkedAccountRepository.deleteByUser(user);
            return "All data wiped successfully";
        }).orElse("User not found");
    }
}
