import axios from 'axios'
import { Message } from 'element-ui';

//请求拦截器
axios.interceptors.request.use(config => {

  return config
}, error => {
  return Promise.reject(error)
});

//响应拦截器即异常处理
axios.interceptors.response.use(resp => {

  return resp
}, error => {

  if (error && error.response) {
    console.info(error);
    switch (error.response.status) {
      case 401:
       // window.localStorage.removeItem('user');
       // window.localStorage.removeItem('code');
        //window.localStorage.removeItem('userInfo');
    	  //router.push('/login');

       window.localStorage.clear();
        location.href = '/login';
        break;

      //其他错误码

      default:
        console.log('HTTP请求返回错误码: ', error.response.data.status_code);
        let errorArr = error.response.data.errors;
        if(errorArr != null && errorArr.length > 0){
        	let errorMessage = "code:" + errorArr[0].code + ", message:" + errorArr[0].message;
        	 Message.warning('请求错误: ' + errorMessage);
        }else{
          Message.warning('HTTP请求返回错误码: ' + error.message);

        }


    }
  } else {
    console.log('HTTP请求出错: ', error.message);
    //console.info(error);
    Message.error('HTTP请求出错: ' + error.message);
  }

  return Promise.reject(error)
})


axios.defaults.baseURL = window.baseConfig.baseUrl

axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest'
}

// axios.defaults.withCredentials = true

//单位毫秒
axios.defaults.timeout = 180000


export default {
  //get请求
  get (url) {
    if(url.startsWith('./') || url.startsWith('../')){
      //请求本地
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: url,
          withCredentials:false,
          baseURL: ''
        }).then(resp => {
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }else {
      //请求远端
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: url,
          withCredentials:false
        }).then(resp => {
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  //post请求
  post (url, data, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        withCredentials:false,
        params: params,
        data: data
      }).then(resp => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //delete请求
  delete (url, data, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: url,
        withCredentials:false,
        params: params,
        data: data
      }).then(resp => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },

  qsGet(url){
    if(url.startsWith('./') || url.startsWith('../')){
      //请求本地


      url.g
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: url,
          withCredentials:false,
          baseURL: ''
        }).then(resp => {
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }else {
      //请求远端
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: url,
          withCredentials:false
        }).then(resp => {
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
