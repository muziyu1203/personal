this.addEventListener('install', function(event) {
  event.waitUntil(   //在安装之前需要执行的操作
    caches.open('v1').then(function(cache) {  //建立一个键名为V1的缓存，添加缓存资源列表
      return cache.addAll([
        './sw_test/',
        './sw_test/index.html',
        './sw_test/style.css',
        './sw_test/app.js',
        './sw_test/star-wars-logo.jpg'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('./sw_test/star-wars-logo.jpg');
  }));
});
