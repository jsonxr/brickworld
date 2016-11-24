
function httpGet(src) {
  console.log('http-utils.httpGet(' + src + ')')

  let xhr = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {
    xhr.onerror = function (e) {
      reject(xhr.statusText);
    };
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.open('GET', src, true);
    xhr.send(null);
  });
}

export { httpGet }
