// java
// File: `SubscriptionController.java`// java
package com.subguard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.subguard.model.Subscription;
import com.subguard.model.User;
import com.subguard.repository.SubscriptionRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private Userrepository userrepository;

    // Accept any content-type (log it) and bind JSON if present
    @PostMapping("/user/{userId}")
    public Subscription addSubscription(@PathVariable Long userId,
                                        @RequestBody Subscription subscription,
                                        HttpServletRequest request) {
        System.out.println("Incoming Content-Type: " + request.getContentType());

        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        subscription.setUser(user);

        if (subscription.isFreeTrial() && subscription.getTrialEndDate() != null) {
            subscription.setRenewalDate(subscription.getTrialEndDate().plusDays(1));
        }

        return subscriptionRepository.save(subscription);
    }

    // Debug endpoint: logs raw body and content-type
    @PostMapping("/user/{userId}/debug")
    public String debugRawBody(@PathVariable Long userId, HttpEntity<String> httpEntity, HttpServletRequest request) {
        String raw = httpEntity.getBody();
        int length = raw == null ? 0 : raw.length();
        System.out.println("DEBUG Content-Type=" + request.getContentType() + " length=" + length + " body=" + raw);
        return "received contentType=" + request.getContentType() + " length=" + length;
    }

    @GetMapping("/user/{userId}")
    public List<Subscription> getUserSubscriptions(@PathVariable Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return subscriptionRepository.findByUser(user);
    }

    @GetMapping("/user/{userId}/upcoming")
    public List<Subscription> getUpcomingSubscriptions(@PathVariable Long userId,
                                                       @RequestParam(defaultValue = "3") int daysAhead) {
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

// java
// Add to `SubscriptionController.java` (imports required below)


    @PostMapping("/user/{userId}/bind-check")
    public ResponseEntity<?> bindCheck(@PathVariable Long userId, HttpEntity<String> httpEntity, HttpServletRequest request) {
        String raw = httpEntity.getBody();
        int length = raw == null ? 0 : raw.length();
        System.out.println("BIND-CHECK Content-Type=" + request.getContentType() + " length=" + length + " body=" + raw);

        if (raw == null || raw.isBlank()) {
            return ResponseEntity.badRequest().body("empty body");
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            Subscription sub = mapper.readValue(raw, Subscription.class);
            return ResponseEntity.ok(sub);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("deserialization error: " + e.getMessage());
        }
    }

}













