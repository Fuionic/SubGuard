package com.subguard.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "linked_accounts")
public class LinkedAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountEmail;

    private String serviceName;

    private LocalDate lastUsedDate;

    private int notifyAfterMonths; // review interval

    private LocalDate nextReviewDate; // // 🔥 new field

    private boolean reviewCompleted = false;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 🔥 Auto-calculate nextReviewDate before saving
    @PrePersist
    @PreUpdate
    public void calculateNextReviewDate() {
        if (lastUsedDate != null && notifyAfterMonths > 0) {
            this.nextReviewDate = lastUsedDate.plusMonths(notifyAfterMonths);
            this.reviewCompleted = false; // reset for next cycle
        }
    }


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDate getLastUsedDate() {
        return lastUsedDate;
    }

    public void setLastUsedDate(LocalDate lastUsedDate) {
        this.lastUsedDate = lastUsedDate;
    }

    public int getNotifyAfterMonths() {
        return notifyAfterMonths;
    }

    public void setNotifyAfterMonths(int notifyAfterMonths) {
        this.notifyAfterMonths = notifyAfterMonths;
    }

    public LocalDate getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(LocalDate nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isReviewCompleted() {
        return reviewCompleted;
    }

    public void setReviewCompleted(boolean reviewCompleted) {
        this.reviewCompleted = reviewCompleted;
    }
}
