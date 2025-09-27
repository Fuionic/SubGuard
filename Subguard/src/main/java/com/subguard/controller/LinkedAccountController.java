package com.subguard.controller;

import com.subguard.model.LinkedAccount;
import com.subguard.model.User;
import com.subguard.repository.LinkedAccountRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class LinkedAccountController {

    @Autowired
    private LinkedAccountRepository linkedAccountRepository;

    @Autowired
    private Userrepository userrepository;

    // Add a linked account
    @PostMapping("/user/{userId}")
    public LinkedAccount addLinkedAccount(@PathVariable Long userId, @RequestBody LinkedAccount account) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        account.setUser(user);
        return linkedAccountRepository.save(account);
    }

    // Get all linked accounts for a user
    @GetMapping("/user/{userId}")
    public List<LinkedAccount> getUserAccounts(@PathVariable Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return linkedAccountRepository.findByUser(user);
    }

    // Get accounts unused beyond notifyAfterMonths
    @GetMapping("/user/{userId}/unused")
    public List<LinkedAccount> getUnusedAccounts(@PathVariable Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        return linkedAccountRepository.findByUser(user)
                .stream()
                .filter(acc -> acc.getLastUsedDate() != null &&
                        acc.getLastUsedDate().plusMonths(acc.getNotifyAfterMonths()).isBefore(today))
                .collect(Collectors.toList());
    }
}
