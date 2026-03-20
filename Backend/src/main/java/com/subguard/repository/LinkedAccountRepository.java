package com.subguard.repository;

import com.subguard.model.LinkedAccount;
import com.subguard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LinkedAccountRepository extends JpaRepository<LinkedAccount, Long> {
    List<LinkedAccount> findByUser(User user);
}
