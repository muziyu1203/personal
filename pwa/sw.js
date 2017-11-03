

//定义缓存的key及缓存列表
var cacheStorageKey = 'pwa-sw20171103-2';
var cacheWhitelist = ['pwa-sw20171103-2'];  //清理缓存，保留whitelist中的缓存，其他的删除
var cacheList = [
         './',
        './index.html',
       // './prerender.html',
        './css/main.css',
        './css/prerender.css',
        // './js/zepto.js',
        // './js/index.js'
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

self.addEventListener('activate', event => event.waitUntil(
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
        )).catch(function(err){
            console.log("err",err);
        })
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
            return fetch(e.request);   //   fetch(fetchRequest, { credentials: 'include' } ); //fetch请求默认不带cookie，可通过此参数将cookie带过去

        }).catch(function(e){
            return fetch(e.request);
        })
    );
});


//监听离线状态
self.addEventListener('offline', function() {
    Notification.requestPermission().then(grant => {
        if (grant !== 'granted') {
            return;
        }

        const notification = new Notification("Hi，网络不给力哟", {
            body: '您的网络貌似离线了，不过在志文工作室里访问过的页面还可以继续打开~',
            icon: '//lzw.me/images/avatar/lzwme-80x80.png'
        });

        notification.onclick = function() {
            notification.close();
        };
    });
});


//错误监控
self.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, error) {
    if (error) {
        console.log(error);
        // reportError(error);
    } else {
        console.log(errorMessage, scriptURI, lineNumber, columnNumber, error)
        // reportError({
        //     message: errorMessage,
        //     script: scriptURI,
        //     line: lineNumber,
        //     column: columnNumber
        // });
    }
}

//当 Promise 类型的回调发生 reject 却没有 catch 处理，会触发 unhandledrejection 事件。

self.addEventListener('unhandledrejection', function(event) {
    console.log("unhandledrejection",event);
    // reportError({
    //     message: event.reason
    // })
});