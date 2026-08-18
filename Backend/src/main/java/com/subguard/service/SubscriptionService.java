package com.subguard.service;

import com.subguard.DTO.SubscriptionDTO;
import com.subguard.errorhandling.SubscriptionException;
import com.subguard.model.Subscription;
import com.subguard.model.User;
import com.subguard.repository.SubscriptionRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final Userrepository userrepository;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository, Userrepository userrepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userrepository = userrepository;
    }

    public SubscriptionDTO addSubscription(Long userId, SubscriptionDTO subscriptionDTO) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new SubscriptionException("User not found"));

        Subscription subscription = convertToEntity(subscriptionDTO);
        subscription.setUser(user);

        if (subscription.isFreeTrial() && subscription.getTrialEndDate() != null) {
            subscription.setRenewalDate(subscription.getTrialEndDate().plusDays(1));
        }

        Subscription saved = subscriptionRepository.save(subscription);
        return convertToDTO(saved);
    }

    public List<SubscriptionDTO> getUserSubscriptions(Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new SubscriptionException("User not found"));
        return subscriptionRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SubscriptionDTO> getUpcomingSubscriptions(Long userId, int daysAhead) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new SubscriptionException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusDays(daysAhead);

        return subscriptionRepository.findByUser(user).stream()
                .filter(sub -> sub.getRenewalDate() != null &&
                        !sub.getRenewalDate().isBefore(today) &&
                        !sub.getRenewalDate().isAfter(thresholdDate))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SubscriptionDTO convertToDTO(Subscription sub) {
        return new SubscriptionDTO(sub.getId(), sub.getName(), sub.getPrice(), sub.getRenewalDate(), sub.isFreeTrial(), sub.getTrialEndDate(), sub.getFrequency());
    }

    private Subscription convertToEntity(SubscriptionDTO dto) {
        Subscription sub = new Subscription();
        sub.setId(dto.getId());
        sub.setName(dto.getName());
        sub.setPrice(dto.getPrice());
        sub.setRenewalDate(dto.getRenewalDate());
        sub.setFreeTrial(dto.isFreeTrial());
        sub.setTrialEndDate(dto.getTrialEndDate());
        sub.setFrequency(dto.getFrequency());
        return sub;
    }
}
