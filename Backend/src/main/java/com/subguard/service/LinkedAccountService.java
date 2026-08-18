package com.subguard.service;

import com.subguard.DTO.LinkedAccountDTO;
import com.subguard.errorhandling.LinkedAccountException;
import com.subguard.model.LinkedAccount;
import com.subguard.model.User;
import com.subguard.repository.LinkedAccountRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LinkedAccountService {

    private final LinkedAccountRepository linkedAccountRepository;
    private final Userrepository userrepository;

    @Autowired
    public LinkedAccountService(LinkedAccountRepository linkedAccountRepository, Userrepository userrepository) {
        this.linkedAccountRepository = linkedAccountRepository;
        this.userrepository = userrepository;
    }

    public LinkedAccountDTO addLinkedAccount(Long userId, LinkedAccountDTO accountDTO) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new LinkedAccountException("User not found"));

        LinkedAccount account = convertToEntity(accountDTO);

        if (account.getLastUsedDate() == null) {
            account.setLastUsedDate(LocalDate.now());
        }

        if (account.getNotifyAfterMonths() <= 0) {
            account.setNotifyAfterMonths(3); // default 3 months
        }

        account.setUser(user);
        LinkedAccount saved = linkedAccountRepository.save(account);
        return convertToDTO(saved);
    }

    public List<LinkedAccountDTO> getUserAccounts(Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new LinkedAccountException("User not found"));

        return linkedAccountRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LinkedAccountDTO> getUnusedAccounts(Long userId) {
        User user = userrepository.findById(userId)
                .orElseThrow(() -> new LinkedAccountException("User not found"));

        LocalDate today = LocalDate.now();

        return linkedAccountRepository.findByUser(user).stream()
                .filter(acc -> acc.getNextReviewDate() != null &&
                        !acc.getNextReviewDate().isAfter(today))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LinkedAccountDTO confirmNotUsing(Long accountId) {
        LinkedAccount account = linkedAccountRepository.findById(accountId)
                .orElseThrow(() -> new LinkedAccountException("Account not found"));

        account.setReviewCompleted(true);
        System.out.println("User should logout from: " + account.getServiceName());
        return convertToDTO(linkedAccountRepository.save(account));
    }

    public LinkedAccountDTO confirmUsage(Long accountId) {
        LinkedAccount account = linkedAccountRepository.findById(accountId)
                .orElseThrow(() -> new LinkedAccountException("Account not found"));

        account.setLastUsedDate(LocalDate.now());
        account.setReviewCompleted(false);
        return convertToDTO(linkedAccountRepository.save(account));
    }

    private LinkedAccountDTO convertToDTO(LinkedAccount acc) {
        return new LinkedAccountDTO(acc.getId(), acc.getAccountEmail(), acc.getServiceName(), acc.getLastUsedDate(), acc.getNotifyAfterMonths(), acc.getNextReviewDate(), acc.isReviewCompleted());
    }

    private LinkedAccount convertToEntity(LinkedAccountDTO dto) {
        LinkedAccount acc = new LinkedAccount();
        acc.setId(dto.getId());
        acc.setAccountEmail(dto.getAccountEmail());
        acc.setServiceName(dto.getServiceName());
        acc.setLastUsedDate(dto.getLastUsedDate());
        acc.setNotifyAfterMonths(dto.getNotifyAfterMonths());
        acc.setNextReviewDate(dto.getNextReviewDate());
        acc.setReviewCompleted(dto.isReviewCompleted());
        return acc;
    }
}
