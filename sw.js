 // Static cache files
 var CACHE_NAME = 'restaurant-cache-v12';
 var urlsToCache = [
     '/',
     '/restaurant.html',
     '/css/styles.css',
     '/css/restaurant.css',
     '/js/main.js',
     '/js/dbhelper.js',
     '/js/restaurant_info.js',
     '/data/restaurants.json'
     
     
 ];

self.addEventListener('install', function(event) {
  
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Add Urls to cache
        console.log('Added Urls to cache')
        return cache.addAll(urlsToCache).catch(function(error){console.log(error);});
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
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream;
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {

                  cache.put(event.request, responseToCache);
                }).catch(function(error){ console.log(error);});
  
              return response;
            }
          ).catch(function(error){console.log(error);});
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