package com.subguard.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkedAccountDTO {
    private Long id;
    private String accountEmail;
    private String serviceName;
    private LocalDate lastUsedDate;
    private int notifyAfterMonths;
    private LocalDate nextReviewDate;
    private boolean reviewCompleted;
}
