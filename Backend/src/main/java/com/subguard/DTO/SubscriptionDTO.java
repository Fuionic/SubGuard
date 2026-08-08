package com.subguard.DTO;

import com.subguard.model.Subscription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO {
    private Long id;
    private String name;
    private double price;
    private LocalDate renewalDate;
    private boolean isFreeTrial;
    private LocalDate trialEndDate;
    private Subscription.Frequency frequency;
}
