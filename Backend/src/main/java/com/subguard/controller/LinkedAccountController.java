package com.subguard.controller;

import com.subguard.model.LinkedAccount;
import com.subguard.service.LinkedAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class LinkedAccountController {

    private final LinkedAccountService linkedAccountService;

    @Autowired
    public LinkedAccountController(LinkedAccountService linkedAccountService) {
        this.linkedAccountService = linkedAccountService;
    }

    @PostMapping("/user/{userId}")
    public LinkedAccount addLinkedAccount(@PathVariable Long userId,
                                          @RequestBody LinkedAccount account) {
        return linkedAccountService.addLinkedAccount(userId, account);
    }

    @GetMapping("/user/{userId}")
    public List<LinkedAccount> getUserAccounts(@PathVariable Long userId) {
        return linkedAccountService.getUserAccounts(userId);
    }

    @GetMapping("/user/{userId}/unused")
    public List<LinkedAccount> getUnusedAccounts(@PathVariable Long userId) {
        return linkedAccountService.getUnusedAccounts(userId);
    }

    @PutMapping("/{accountId}/confirm-not-using")
    public LinkedAccount confirmNotUsing(@PathVariable Long accountId) {
        return linkedAccountService.confirmNotUsing(accountId);
    }

    @PutMapping("/{accountId}/confirm-usage")
    public LinkedAccount confirmUsage(@PathVariable Long accountId) {
        return linkedAccountService.confirmUsage(accountId);
    }
}
