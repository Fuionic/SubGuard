package com.subguard.controller;

import com.subguard.DTO.SubscriptionDTO;
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
    public SubscriptionDTO addSubscription(@PathVariable Long userId,
                                           @RequestBody SubscriptionDTO subscriptionDTO) {
        return subscriptionService.addSubscription(userId, subscriptionDTO);
    }

    @GetMapping("/user/{userId}")
    public List<SubscriptionDTO> getUserSubscriptions(@PathVariable Long userId) {
        return subscriptionService.getUserSubscriptions(userId);
    }

    @GetMapping("/user/{userId}/upcoming")
    public List<SubscriptionDTO> getUpcomingSubscriptions(@PathVariable Long userId,
                                                          @RequestParam(defaultValue = "3") int daysAhead) {
        return subscriptionService.getUpcomingSubscriptions(userId, daysAhead);
    }
}
