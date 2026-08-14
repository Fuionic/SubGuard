package com.subguard.service;

import com.subguard.repository.Userrepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final Userrepository UserRepository;

    public CustomUserDetailService(Userrepository UserRepository) {
        this.UserRepository = UserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        return UserRepository.findByEmail(identifier)
                .orElseGet(() -> UserRepository.findByUsername(identifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + identifier)));
    }
}
