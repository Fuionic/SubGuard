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


    /*
        SUBSCRIPTION REMINDERS
        ----------------------
        Renewal date = R

        R-2 days 8 AM
        R-2 days 9 PM
        R-1 day  9 PM
        R day    8 AM
     */

    // Morning reminders (8 AM)
    // For testing we use fixedRate
    // In production change to: @Scheduled(cron = "0 0 8 * * ?")
    @Scheduled(fixedRate = 10000)
    public void checkSubscriptionsMorning() {

        LocalDate today = LocalDate.now();

        for (User user : userrepository.findAll()) {
            if (!user.isNotificationsEnabled()) continue;
            
            String targetEmail = user.getNotificationEmail() != null ? user.getNotificationEmail() : user.getEmail();

            List<Subscription> subs = subscriptionRepository.findByUser(user);

            for (Subscription sub : subs) {

                // ---------- Trial logic (existing) ----------
                if (sub.isFreeTrial() && sub.getTrialEndDate() != null &&
                        !sub.getTrialEndDate().isBefore(today) &&
                        !sub.getTrialEndDate().isAfter(today.plusDays(3))) {

                    System.out.println("Notification for user " + targetEmail +
                            ": Trial for " + sub.getName() +
                            " ends on " + sub.getTrialEndDate());
                }

                // ---------- Renewal logic ----------
                if (sub.getRenewalDate() == null) continue;

                LocalDate renewalDate = sub.getRenewalDate();

                // 2 days before renewal (morning reminder)
                if (renewalDate.minusDays(2).isEqual(today)) {

                    System.out.println("Reminder for user " + targetEmail +
                            ": Your subscription " + sub.getName() +
                            " will renew in 2 days on " + renewalDate);
                }

                // Renewal day reminder
                if (renewalDate.isEqual(today)) {

                    System.out.println("Reminder for user " + targetEmail +
                            ": Your subscription " + sub.getName() +
                            " renews today.");
                }
            }
        }
    }


    // Night reminders (9 PM)
    // Production: @Scheduled(cron = "0 0 21 * * ?")
    @Scheduled(fixedRate = 10000)
    public void checkSubscriptionsNight() {

        LocalDate today = LocalDate.now();

        for (User user : userrepository.findAll()) {
            if (!user.isNotificationsEnabled()) continue;

            String targetEmail = user.getNotificationEmail() != null ? user.getNotificationEmail() : user.getEmail();

            List<Subscription> subs = subscriptionRepository.findByUser(user);

            for (Subscription sub : subs) {

                if (sub.getRenewalDate() == null) continue;

                LocalDate renewalDate = sub.getRenewalDate();

                // 2 days before renewal (night reminder)
                if (renewalDate.minusDays(2).isEqual(today)) {

                    System.out.println("Evening reminder for user " + targetEmail +
                            ": Your subscription " + sub.getName() +
                            " renews in 2 days.");
                }

                // 1 day before renewal (final warning)
                if (renewalDate.minusDays(1).isEqual(today)) {

                    System.out.println("Final reminder for user " + targetEmail +
                            ": Your subscription " + sub.getName() +
                            " renews tomorrow.");
                }
            }
        }
    }


    /*
        LINKED ACCOUNT REMINDERS
        ------------------------
        Reminds user to review inactive accounts
        Runs every few hours (testing every 10 sec)
     */
    @Scheduled(cron = "0 0 */3 * * ?")
    public void checkUnusedLinkedAccounts() {

        LocalDate today = LocalDate.now();

        for (User user : userrepository.findAll()) {
            if (!user.isNotificationsEnabled()) continue;

            String targetEmail = user.getNotificationEmail() != null ? user.getNotificationEmail() : user.getEmail();

            List<LinkedAccount> accounts = linkedAccountRepository.findByUser(user);

            for (LinkedAccount acc : accounts) {

                if (acc.getNextReviewDate() == null) continue;

                // Only notify on the exact review date
                if (acc.getNextReviewDate().isEqual(today) && !acc.isReviewCompleted()) {

                    System.out.println("Reminder for user " + targetEmail +
                            ": Are you still using " +
                            acc.getServiceName() +
                            " (" + acc.getAccountEmail() + ")?");
                }
            }
        }
    }
}