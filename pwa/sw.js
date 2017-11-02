

//定义缓存的key及缓存列表
var cacheStorageKey = 'usercalendar-sw1';
var cacheWhitelist = ['usercalendarsw-1'];  //清理缓存，保留whitelist中的缓存，其他的删除
var cacheList = [
         './',
        './index.html',
        './prerender.html',
        './css/prerender.css',
        '/js/zepto.js',
        './js/index.js'
  ];

self.addEventListener("install",function(e){
    console.log("sw install trigger",e);
    e.waitUntil( //安装成功后 ServiceWorker 状态会从 installing 变为 installed
        caches.open(cacheStorageKey)
        .then(cache => cache.addAll(cacheList))   //cacheList中的文件全部安装完成才能
        .then(() => self.skipWaiting())  //self.skipWaiting() 页面更新的过程当中, 新的 Service Worker 脚本能立即激活和生效
    )
});


// 如果希望在有了新版本时，所有的页面都得到及时更新，则在安装阶段跳过等待，直接进入 active
/*self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});*/

self.addEventListener('activate', evnet => event.waitUntil(
    Promise.all([
        // 更新客户端
        clients.claim(),
        // 清理旧版本
        caches.keys().then(cacheList => Promise.all(
            cacheList.map(cacheName => {
                //if (cacheName !== CACHE_NAME) {
                if(cacheWhitelist.indexOf(cacheName)==-1){
                    caches.delete(cacheName);
                }
            })
        ))
    ])
));
//更新缓存，清理旧缓存
/*self.addEventListener("activate",function(e){
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
});*/



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



//错误监控
self.addEventListener("error",function(e){
    console.log("error触发",e);
});
self.addEventListener("unhandledrejection",function(e){
    console.log("unhandledrejection触发",e);
});