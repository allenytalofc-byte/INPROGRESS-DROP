self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = (data.notification && data.notification.title) || 'Nova notificação';
  const body = (data.notification && data.notification.body) || '';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
    })
  );
});