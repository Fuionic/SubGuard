package com.subguard.controller;

import com.subguard.DTO.LinkedAccountDTO;
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
    public LinkedAccountDTO addLinkedAccount(@PathVariable Long userId,
                                             @RequestBody LinkedAccountDTO accountDTO) {
        return linkedAccountService.addLinkedAccount(userId, accountDTO);
    }

    @GetMapping("/user/{userId}")
    public List<LinkedAccountDTO> getUserAccounts(@PathVariable Long userId) {
        return linkedAccountService.getUserAccounts(userId);
    }

    @GetMapping("/user/{userId}/unused")
    public List<LinkedAccountDTO> getUnusedAccounts(@PathVariable Long userId) {
        return linkedAccountService.getUnusedAccounts(userId);
    }

    @PutMapping("/{accountId}/confirm-not-using")
    public LinkedAccountDTO confirmNotUsing(@PathVariable Long accountId) {
        return linkedAccountService.confirmNotUsing(accountId);
    }

    @PutMapping("/{accountId}/confirm-usage")
    public LinkedAccountDTO confirmUsage(@PathVariable Long accountId) {
        return linkedAccountService.confirmUsage(accountId);
    }
}
