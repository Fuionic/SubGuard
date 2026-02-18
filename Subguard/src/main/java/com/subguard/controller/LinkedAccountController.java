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

    @PostMapping("/user/{userId}")
    public LinkedAccount addLinkedAccount(@PathVariable Long userId,
                                          @RequestBody LinkedAccount account) {

        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (account.getLastUsedDate() == null) {
            account.setLastUsedDate(LocalDate.now());
        }

        if (account.getNotifyAfterMonths() <= 0) {
            account.setNotifyAfterMonths(3); // default 3 months
        }

        account.setUser(user);

        return linkedAccountRepository.save(account);
    }

    @GetMapping("/user/{userId}")
    public List<LinkedAccount> getUserAccounts(@PathVariable Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return linkedAccountRepository.findByUser(user);
    }

    @GetMapping("/user/{userId}/unused")
    public List<LinkedAccount> getUnusedAccounts(@PathVariable Long userId) {

        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        return linkedAccountRepository.findByUser(user)
                .stream()
                .filter(acc -> acc.getNextReviewDate() != null &&
                        !acc.getNextReviewDate().isAfter(today))
                .toList();
    }

    //http://localhost:8080/api/accounts/1/confirm-usage
    @PutMapping("/{accountId}/confirm-usage")
    public LinkedAccount confirmUsage(@PathVariable Long accountId) {

        LinkedAccount account = linkedAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setLastUsedDate(LocalDate.now());
        account.setReviewCompleted(true);

        return linkedAccountRepository.save(account);
    }

}
