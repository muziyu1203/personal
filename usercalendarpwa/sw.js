

//定义缓存的key及缓存列表
var cacheStorageKey = 'sw-usercalendar';
var cacheWhitelist = ['sw-usercalendar'];  //清理缓存，保留whitelist中的缓存，其他的删除
var cacheList = [
        // './',
        './index.html',
        './prerender.html',
        './css/main.css',
        './css/prerender.css',
        './js/index.js',
  ];

self.addEventListener("install",function(e){
    console.log("sw install trigger",e);
    e.waitUntil(
        caches.open(cacheStorageKey)
        .then(cache => cache.addAll(cacheList))
        .then(() => self.skipWaiting())  //self.skipWaiting() 页面更新的过程当中, 新的 Service Worker 脚本能立即激活和生效
    )
});


//监听资源请求  判断是否从缓存中获取
self.addEventListener("fetch",function(e){

    console.log("资源请求 fetch事件触发",e);
    e.respondWith(
        caches.match(e.request)
        .then(function(response){
            if(response!=null){
                return response;
            }
            return fetch(e.request);
        }).catch(function(){
            return fetch(e.request);
        })
    );
});

//更新缓存，清理就缓存
self.addEventListener("activate",function(e){
   console.log("清理旧缓存");
   e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                console.log("缓存列表中的key",key);
                if(cacheWhitelist.indexOf(key)==-1){
                    console.log("删除key",key);
                    return caches.delete(key);
                }
            }));
        })
    )
});

//错误监控
self.addEventListener("error",function(e){
    console.log("error触发",e);
});
self.addEventListener("unhandledrejection",function(e){
    console.log("unhandledrejection触发",e);
});