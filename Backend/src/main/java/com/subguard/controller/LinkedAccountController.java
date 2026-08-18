package com.subguard.controller;

import com.subguard.DTO.LinkedAccountDTO;
import com.subguard.service.LinkedAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<LinkedAccountDTO> addLinkedAccount(@PathVariable Long userId,
                                             @RequestBody LinkedAccountDTO accountDTO) {
        LinkedAccountDTO createdAccount = linkedAccountService.addLinkedAccount(userId, accountDTO);
        return new ResponseEntity<>(createdAccount, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LinkedAccountDTO>> getUserAccounts(@PathVariable Long userId) {
        List<LinkedAccountDTO> accounts = linkedAccountService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/user/{userId}/unused")
    public ResponseEntity<List<LinkedAccountDTO>> getUnusedAccounts(@PathVariable Long userId) {
        List<LinkedAccountDTO> unusedAccounts = linkedAccountService.getUnusedAccounts(userId);
        return ResponseEntity.ok(unusedAccounts);
    }

    @PutMapping("/{accountId}/confirm-not-using")
    public ResponseEntity<LinkedAccountDTO> confirmNotUsing(@PathVariable Long accountId) {
        LinkedAccountDTO updatedAccount = linkedAccountService.confirmNotUsing(accountId);
        return ResponseEntity.ok(updatedAccount);
    }

    @PutMapping("/{accountId}/confirm-usage")
    public ResponseEntity<LinkedAccountDTO> confirmUsage(@PathVariable Long accountId) {
        LinkedAccountDTO updatedAccount = linkedAccountService.confirmUsage(accountId);
        return ResponseEntity.ok(updatedAccount);
    }
}
