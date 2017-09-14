'use strict';

/**
 * when push notification from the server is arrive
 */
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] - push received');
  console.log(`[ServiceWorker] - push data : ${event.data.text()}`);

  const title = 'Push Codelab';
  const options = {
    body: 'This is notificatin body',
    icon: 'img/IconNews.png',
    badge: 'img/IconNews.png'
  }
  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * when user click the notification
 */
self.addEventListener('notifivationClick', (event) => {
  console.log('[ServiceWorker] - notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});
