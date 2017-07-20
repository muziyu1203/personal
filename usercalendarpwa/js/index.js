

var common = {
        //domid:加载子页面的父dom选择器
        //htmlPage：加载子页面html的文件路径
        //callback：回调方法
        fLoadPage: function(domid, htmlPage, callback) { //加载子页面及js
            if (typeof(callback) == 'function') {
                $(domid).load(htmlPage, callback);
            } else {
                $(domid).load(htmlPage);
            }
        },
        /*
         *加载模块，html与js文件名相同
         *domId:容器Id名称,加载html的容器
         *module:模块名称
         */
        /*fLoadModule: function(domId, module, params) {
            if (!module) {
                PAS.CommonAPI.fAlert("", "模块不能为空", "");
                return;
            }
            $(domId).load(module + ".html", function() {
                require.async("./" + module + ".js", function(mObj) {
                    if (mObj) {
                        mObj.initialize(params);
                    }
                });
            });
        }*/

    };





    var APP = {
        initialize: function(){
            common.fLoadPage("#pre-render-zone","prerender.html");
            // common.fLoadModule("#wrap","todoList");
            this.fInstallServiceWorker();
        },
        fInstallServiceWorker: function(){
            if(navigator.serviceWorker){
                console.log("支持service worker");
                navigator.serviceWorker.register('/personal/usercalendarpwa/sw.js',{scope:"/personal/usercalendarpwa/"}).then(function(reg){
                    console.log("注册完成后",reg);
                   if(reg.installing) {
                      console.log('Service worker installing。。。');
                    }
                     if(reg.waiting) {
                      console.log('Service worker installed。。。');
                    }
                     if(reg.active) {
                      console.log('Service worker active。。。');
                    }
                });
            }
        }
    };
    APP.initialize();

