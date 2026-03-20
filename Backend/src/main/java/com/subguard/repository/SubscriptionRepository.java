package com.subguard.repository;

import com.subguard.model.Subscription;
import com.subguard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // Get all subscriptions for a user
    List<Subscription> findByUser(User user);

    // Optional: find subscriptions whose renewal date is before a certain date
    List<Subscription> findByUserAndRenewalDateBefore(User user, LocalDate date);

    // Optional: find subscriptions whose trial ends before a certain date
    List<Subscription> findByUserAndTrialEndDateBefore(User user, LocalDate date);
}
