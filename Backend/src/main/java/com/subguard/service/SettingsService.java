package com.subguard.service;

import com.subguard.DTO.UserDTO;
import com.subguard.errorhandling.GeneralException;
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

    public Optional<UserDTO> getSettings(Long userId) {
        return userrepository.findById(userId).map(this::convertToDTO);
    }

    public String updateSettings(Long userId, UserDTO updatedUser) {
        return userrepository.findById(userId).map(user -> {
            user.setName(updatedUser.getName());
            user.setNotificationsEnabled(updatedUser.isNotificationsEnabled());
            user.setNotificationEmail(updatedUser.getNotificationEmail());
            userrepository.save(user);
            return "Settings updated successfully";
        }).orElseThrow(() -> new GeneralException("User not found"));
    }

    @Transactional
    public String wipeData(Long userId) {
        return userrepository.findById(userId).map(user -> {
            subscriptionRepository.deleteByUser(user);
            linkedAccountRepository.deleteByUser(user);
            return "All data wiped successfully";
        }).orElseThrow(() -> new GeneralException("User not found"));
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.isNotificationsEnabled(), user.getNotificationEmail());
    }
}
