package com.subguard.service;

import com.subguard.model.LinkedAccount;
import com.subguard.model.User;
import com.subguard.repository.LinkedAccountRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LinkedAccountService {

    private final LinkedAccountRepository linkedAccountRepository;
    private final Userrepository userrepository;

    @Autowired
    public LinkedAccountService(LinkedAccountRepository linkedAccountRepository, Userrepository userrepository) {
        this.linkedAccountRepository = linkedAccountRepository;
        this.userrepository = userrepository;
    }

    public LinkedAccount addLinkedAccount(Long userId, LinkedAccount account) {
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

    public List<LinkedAccount> getUserAccounts(Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return linkedAccountRepository.findByUser(user);
    }

    public List<LinkedAccount> getUnusedAccounts(Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        return linkedAccountRepository.findByUser(user)
                .stream()
                .filter(acc -> acc.getNextReviewDate() != null &&
                        !acc.getNextReviewDate().isAfter(today))
                .toList();
    }

    public LinkedAccount confirmNotUsing(Long accountId) {
        LinkedAccount account = linkedAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setReviewCompleted(true);
        System.out.println("User should logout from: " + account.getServiceName());
        return linkedAccountRepository.save(account);
    }

    public LinkedAccount confirmUsage(Long accountId) {
        LinkedAccount account = linkedAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setLastUsedDate(LocalDate.now());
        account.setReviewCompleted(false);

        return linkedAccountRepository.save(account);
    }
}
