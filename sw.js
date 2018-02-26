 // Static cache files
 var CACHE_NAME = 'restaurant-cache-v11';
 var urlsToCache = [
     '/',
     '/css/styles.css',
     '/css/restaurant.css',
     '/js/main.js',
     '/js/dbhelper.js',
     '/js/restaurant_info.js',
     '/data/restaurants.json',
     'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
     'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2'
     
 ];

self.addEventListener('install', function(event) {
  
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Add Urls to cache
        console.log('Added Urls to cache')
        return cache.addAll(urlsToCache);
      })
  );
});

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // IMPORTANT: Clone the request.
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200) {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream;
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  }); 

  
  self.addEventListener('activate', function(event) {
    console.log('activating serviceWorker');
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            
              return caches.delete(cacheName);
            
          })
        );
      })
    );
  });