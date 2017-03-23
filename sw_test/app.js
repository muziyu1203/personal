// register service worker
 //1、先检测浏览器是否支持service worker。如果支持，则注册一个serviceworker，即一个js文件,其路径是相对于origin
 //2、注册完成后，浏览器会尝试安装 激活service worker
if ('serviceWorker' in navigator) {  //如果支持，则注册一个serviceworker，即一个js文件,其路径是相对于origin
  navigator.serviceWorker.register('/personal/sw-test/sw.js', { scope: '/personal/sw-test/' }).then(function(reg) {
    console.log("注册完成后",reg);
    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

// function for loading each image via XHR

function imgLoad(imgJSON) {
  // return a promise for an image loading
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', imgJSON.url);
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

var imgSection = document.querySelector('section');

window.onload = function() {

  // load each set of image, alt text, name and caption
  // for(var i = 0; i<=Gallery.images.length-1; i++) {
    imgLoad({'url':'star-wars-logo.jpg'}).then(function(arrayResponse) {

      var myImage = document.createElement('img');
      var imageURL = window.URL.createObjectURL(arrayResponse[0]);
      myImage.src = imageURL;
      imgSection.appendChild(myImage);

    }, function(Error) {
      console.log(Error);
    });
  // }
};
