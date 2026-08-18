package com.subguard.controller;

import com.subguard.DTO.SubscriptionDTO;
import com.subguard.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SubscriptionDTO> addSubscription(@PathVariable Long userId,
                                           @RequestBody SubscriptionDTO subscriptionDTO) {
        SubscriptionDTO createdSubscription = subscriptionService.addSubscription(userId, subscriptionDTO);
        return new ResponseEntity<>(createdSubscription, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionDTO>> getUserSubscriptions(@PathVariable Long userId) {
        List<SubscriptionDTO> subscriptions = subscriptionService.getUserSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<SubscriptionDTO>> getUpcomingSubscriptions(@PathVariable Long userId,
                                                          @RequestParam(defaultValue = "3") int daysAhead) {
        List<SubscriptionDTO> upcomingSubscriptions = subscriptionService.getUpcomingSubscriptions(userId, daysAhead);
        return ResponseEntity.ok(upcomingSubscriptions);
    }
}
