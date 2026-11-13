// MTC AIR: รับแจ้งเตือนตอนปิดแอป
var ICON = 'S_12583103.jpg';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try {
    var j = e.data ? e.data.json() : {};
    d = j.data || j.notification || j || {};
  } catch (err) {
    d = { title: 'MTC AIR', body: e.data ? e.data.text() : '' };
  }
  var opts = {
    body: d.body || '',
    icon: ICON,
    badge: ICON,
    requireInteraction: true,
    vibrate: [500, 150, 500, 150, 900],
    data: { url: d.url || './' }
  };
  if (d.tag) { opts.tag = d.tag; opts.renotify = true; }
  e.waitUntil(self.registration.showNotification(d.title || 'MTC AIR', opts));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if ('focus' in list[i]) return list[i].focus();
    }
    return self.clients.openWindow(url);
  }));
});
