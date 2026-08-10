package com.subguard.controller;

import com.subguard.model.Subscription;
import com.subguard.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/user/{userId}")
    public Subscription addSubscription(@PathVariable Long userId,
                                        @RequestBody Subscription subscription) {
        return subscriptionService.addSubscription(userId, subscription);
    }

    @GetMapping("/user/{userId}")
    public List<Subscription> getUserSubscriptions(@PathVariable Long userId) {
        return subscriptionService.getUserSubscriptions(userId);
    }

    @GetMapping("/user/{userId}/upcoming")
    public List<Subscription> getUpcomingSubscriptions(@PathVariable Long userId,
                                                       @RequestParam(defaultValue = "3") int daysAhead) {
        return subscriptionService.getUpcomingSubscriptions(userId, daysAhead);
    }
}
