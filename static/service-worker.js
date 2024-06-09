self.addEventListener("install", async (event) => {
  /*
    Prepare your service worker for usage when this fires,
    for example by creating a cache using the built in storage API,
    and placing assets inside it that you'll want for running your app offline
  */
  console.group('install');
  console.log('%c sw installed', 'color: red');
  console.log('install event: ', event);
  console.log('calling self.skipWaiting()...');
  self.skipWaiting();
  console.log('done');
  console.groupEnd();
});

self.addEventListener("activate", (event) => {
  /*
    Generally a good time to clean up old caches and
    other things associated with the previous version
    of your service worker
  */
  console.group('activate');
  console.log('%c sw activated', 'color: red');
  console.log('activated event: ', event);
  console.log('calling clients.claim()...');
  event.waitUntil(clients.claim());
  console.log('donee');
  console.groupEnd();
});

self.addEventListener("push", (event) => {
  let pushData = event.data.json();
  console.group('push');
  console.log('push data: ', pushData);
  console.groupEnd();
  event.waitUntil(
    self.registration.showNotification(pushData.title, {
      body: pushData.subtitle,
      icon: pushData.icon,
      image: pushData.icon,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    })
  );
});
