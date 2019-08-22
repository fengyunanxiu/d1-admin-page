// import md5 from 'js-md5';
// import CryptoJS from 'crypto-js';
// import http from '@/assets/js/http'
// import FileServiceSignatureUrl from '@/assets/js/constant/file-service-signature-url.js'
// import baseUrl from '@/assets/js/base-url.js'
// // import baseSSO from "../assets/js/base-sso";
// // import baseSSOFED from "../assets/js/base-ssofed";
//
//
// let secret = window.BaseConfigInfo.baseSSO.secret;

/**
 * 工具类
 */
export default {
  /**
   * 自定义生成uuid方法
   */
  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
  // 对象的深度克隆（Array / obj /...）
  deepClone(obj) {
    var str, retObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window.JSON) {
      str = JSON.stringify(obj);
      retObj = JSON.parse(str);
    }
    else {
      for (var prop in obj) {
        retObj[prop] = typeof obj[prop] === 'object' ? deepClone(obj[prop]) : obj[prop];
      }
    }
    return retObj;
  },
  uploadFileForElementUpload(request,that){

    let formData = new FormData();
    formData.append("multipartFile", request.file);
    let  xhr = new XMLHttpRequest();
    xhr.open('post', request.action, false);
    xhr.onload = that.handleSuccess; //请求完成
    xhr.onerror =  that.handleError; //请求失败
    xhr.send(formData); //开始上传，发送form数据
  },
  // 把url中的参数转化为json对象
  parseQueryString: function (url) {
    var reg_url = /^[^\?]+\?([\w\W]+)$/,
        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
        arr_url = reg_url.exec(url),
        ret = {};
    if (arr_url && arr_url[1]) {
      var str_para = arr_url[1], result;
      while ((result = reg_para.exec(str_para)) != null) {
        ret[result[1]] = result[2];
      }
    }
    return ret;
  },




  // 匹配字母，数字，下划线
  matchWordCase(str){
    return this.match("^[0-9a-zA-Z_]{1,}$",str);
  },
  // 判断是否匹配
  match(patternStr,matchStr){
    let reg = new  RegExp(patternStr);
    return reg.test(matchStr);

  }
}
