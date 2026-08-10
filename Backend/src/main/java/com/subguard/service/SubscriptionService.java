package com.subguard.service;

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

    public Subscription addSubscription(Long userId, Subscription subscription) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        subscription.setUser(user);

        if (subscription.isFreeTrial() && subscription.getTrialEndDate() != null) {
            subscription.setRenewalDate(subscription.getTrialEndDate().plusDays(1));
        }

        return subscriptionRepository.save(subscription);
    }

    public List<Subscription> getUserSubscriptions(Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return subscriptionRepository.findByUser(user);
    }

    public List<Subscription> getUpcomingSubscriptions(Long userId, int daysAhead) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusDays(daysAhead);

        return subscriptionRepository.findByUser(user)
                .stream()
                .filter(sub -> sub.getRenewalDate() != null &&
                        !sub.getRenewalDate().isBefore(today) &&
                        !sub.getRenewalDate().isAfter(thresholdDate))
                .collect(Collectors.toList());
    }
}
