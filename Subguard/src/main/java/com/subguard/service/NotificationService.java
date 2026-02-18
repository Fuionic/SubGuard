package com.subguard.service;

import com.subguard.model.LinkedAccount;
import com.subguard.model.Subscription;
import com.subguard.model.User;
import com.subguard.repository.LinkedAccountRepository;
import com.subguard.repository.SubscriptionRepository;
import com.subguard.repository.Userrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private Userrepository userrepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private LinkedAccountRepository linkedAccountRepository;

    // Check every day at 8 AM (cron: second, minute, hour, day, month, day-of-week)
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkSubscriptions() {
        List<User> users = userrepository.findAll();
        LocalDate today = LocalDate.now();

        for (User user : users) {
            List<Subscription> subs = subscriptionRepository.findByUser(user);

            for (Subscription sub : subs) {
                // Check trial ending soon
                if (sub.isFreeTrial() && sub.getTrialEndDate() != null &&
                        !sub.getTrialEndDate().isBefore(today) &&
                        !sub.getTrialEndDate().isAfter(today.plusDays(3))) {
                    System.out.println("Notification for user " + user.getEmail() +
                            ": Trial for " + sub.getName() + " ends on " + sub.getTrialEndDate());
                }

                // Check renewal coming up
                if (sub.getRenewalDate() != null &&
                        !sub.getRenewalDate().isBefore(today) &&
                        !sub.getRenewalDate().isAfter(today.plusDays(3))) {
                    System.out.println("Notification for user " + user.getEmail() +
                            ": Subscription " + sub.getName() + " renews on " + sub.getRenewalDate());
                }
            }
        }
    }

    @Scheduled(fixedRate = 10000)
    // Every 3 hours
    public void checkUnusedLinkedAccounts() {

        List<User> users = userrepository.findAll();
        LocalDate today = LocalDate.now();

        for (User user : users) {

            List<LinkedAccount> accounts = linkedAccountRepository.findByUser(user);

            for (LinkedAccount acc : accounts) {

                if (acc.getNextReviewDate() != null &&
                        acc.getNextReviewDate().isEqual(today) &&
                        !acc.isReviewCompleted())  {

                    System.out.println("Reminder for user " + user.getEmail() +
                            ": Review your login for " +
                            acc.getServiceName() +
                            " (" + acc.getAccountEmail() + ").");

                }
            }
        }
    }


}
