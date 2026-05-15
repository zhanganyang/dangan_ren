window.loadXjData = function (id) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = "./data/" + id + ".js";
    script.onload = function () {
      if (window.XJ_DATA) {
        var data = window.XJ_DATA;
        window.XJ_DATA = undefined;
        resolve(data);
      } else {
        reject(new Error("数据格式错误: " + id));
      }
      script.remove();
    };
    script.onerror = function () {
      reject(new Error("加载失败: data/" + id + ".js"));
    };
    document.head.appendChild(script);
  });
};

window.loginXjUser = function (username, password) {
  return new Promise(function (resolve, reject) {
    var ids = window.USER_IDS || [];
    var index = 0;

    function checkNext() {
      if (index >= ids.length) {
        reject(new Error("用户名或密码错误"));
        return;
      }

      window
        .loadXjData(ids[index++])
        .then(function (data) {
          if (data.username === username && data.password === password) {
            resolve(data);
            return;
          }
          checkNext();
        })
        .catch(function () {
          checkNext();
        });
    }

    checkNext();
  });
};
