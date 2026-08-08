import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    if (Notification.permission === 'default' || Notification.permission === 'undefined') {
      Notification.requestPermission();
    }

    const checkNotifications = async () => {
      try {
        const [subsRes, accountsRes] = await Promise.all([
          apiClient.get(`/subscriptions/user/${userId}`).catch(e => ({ data: [] })),
          apiClient.get(`/linkedaccounts/user/${userId}`).catch(e => ({ data: [] }))
        ]);

        const subs = subsRes.data || [];
        const accounts = accountsRes.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newAlerts = [];

        subs.forEach(sub => {
          // Trial logic
          if (sub.isFreeTrial && sub.trialEndDate) {
            const [tyear, tmonth, tday] = sub.trialEndDate.split('-');
            const endDate = new Date(tyear, tmonth - 1, tday);
            const diffTime = endDate.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= 3) {
              newAlerts.push({
                id: `trial_${sub.id}_${today.getTime()}`,
                type: 'trial',
                message: `Trial for ${sub.name} ends on ${sub.trialEndDate}`
              });
            }
          }

          // Renewal logic
          if (sub.renewalDate && sub.renewalDate !== 'Monthly' && sub.renewalDate !== 'Yearly') {
            const [ryear, rmonth, rday] = sub.renewalDate.split('-');
            const renewDate = new Date(ryear, rmonth - 1, rday);
            const diffTime = renewDate.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 2) {
              newAlerts.push({
                id: `renew_2d_${sub.id}_${today.getTime()}`,
                type: 'renewal',
                message: `Your subscription ${sub.name} will renew in 2 days on ${sub.renewalDate}`
              });
            } else if (diffDays === 1) {
              newAlerts.push({
                id: `renew_1d_${sub.id}_${today.getTime()}`,
                type: 'renewal',
                message: `Your subscription ${sub.name} renews tomorrow.`
              });
            } else if (diffDays === 0) {
              newAlerts.push({
                id: `renew_0d_${sub.id}_${today.getTime()}`,
                type: 'renewal',
                message: `Your subscription ${sub.name} renews today.`
              });
            }
          }
        });

        accounts.forEach(acc => {
          if (acc.nextReviewDate && !acc.reviewCompleted) {
            const reviewDate = new Date(acc.nextReviewDate);
            reviewDate.setHours(0, 0, 0, 0);
            
            if (reviewDate.getTime() === today.getTime()) {
              newAlerts.push({
                id: `acc_review_${acc.id}_${today.getTime()}`,
                type: 'review',
                message: `Are you still using ${acc.serviceName} (${acc.accountEmail})?`
              });
            }
          }
        });

        setNotifications(newAlerts);
        setUnreadCount(newAlerts.length);

        // Show OS Notifications for unnotified alerts
        if (Notification.permission === 'granted') {
          const notifiedIds = JSON.parse(localStorage.getItem('notifiedAlertIds') || '[]');
          const toNotify = newAlerts.filter(a => !notifiedIds.includes(a.id));
          
          toNotify.forEach(alert => {
            new Notification('SubGuard Alert', { body: alert.message, icon: '/logo.png' });
            notifiedIds.push(alert.id);
          });
          
          localStorage.setItem('notifiedAlertIds', JSON.stringify(notifiedIds));
        }

      } catch (err) {
        console.error('Failed to fetch notifications logic', err);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 10 * 60 * 1000); // Check every 10 min

    return () => clearInterval(interval);
  }, [userId]);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAllAsRead };
};

export default useNotifications;
