package com.subguard.repository;

import com.subguard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Userrepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername (String username);
    Optional<User> findByEmail(String email);
}
