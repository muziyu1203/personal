this.addEventListener('install', function(event) {
  event.waitUntil(   //在安装之前需要执行的操作
    caches.open('v2').then(function(cache) {  //建立一个键名为V1的缓存，添加缓存资源列表
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './app.js',
        './star-wars-logo.jpg'
      ]);
    })
  );
});


//每次任何被 service worker 控制的资源被请求到时，都会触发 fetch 事件
this.addEventListener('fetch', function(event) {
  var response;
  //给 service worker 添加一个 fetch 的事件监听器，接着调用 event 上的 respondWith() 方法来劫持 HTTP 响应，然后可以用自己的方法来更新他们。
  //caches.match(event.request) 允许我们对网络请求的资源和 cache 里可获取的资源进行匹配，查看是否缓存中有相应的资源
  event.respondWith(caches.match(event.request).catch(function() {
    //如果没有从缓存中匹配成功，则通过fetch请求网络资源
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v2').then(function(cache) {    //匹配成功，
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {   //当缓存中没有匹配成功，也没有网络时，回退方案
    return caches.match('./strategy.png');
  }));
});


//清理旧缓存
this.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v2'];   //当前新的缓存   删除除此之外的缓存

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// chrome://inspect/#service-workers 可以展示当前设备上激活和存储的 service worker。
//  chrome://serviceworker-internals 可以展示更多细节来允许你开始/暂停/调试 worker 的进程