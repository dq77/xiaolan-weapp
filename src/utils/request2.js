
import Taro from '@tarojs/taro';
import { baseUrl, noConsole } from '../config';
import {getCookie, hasToken} from '../utils/save-token'

let Token;
if (hasToken('token')) {
  Token = getCookie('token'); 
  
}
//  const Token = 'taozugongeyJhbGciOiJIUzUxMiJ9.eyJST0xFIjoiMjEiLCJ1aWQiOiIyMSIsImdlbnRUaW1lIjoxNTUyNTI4NzEzMTAwLCJleHAiOjE1NTI2Mjg4NDN9.c8Ru_A0n-GJOes_t66DpP0dVV75NzH9Y2dnvyDrnwp_xJtWH22Dd3uPwQs6HaZzuVBybg5jK4HDAesMB63J4MA';

export default (options = { method: 'GET', data: {} }) => {
  if (!noConsole) {
    
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: baseUrl + options.url,
      data: options.data,
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization' : Token // 请求携带token
      },
      method: options.method.toUpperCase(),
    }).then((res) => {
      const { statusCode, data } = res;
      if (statusCode >= 200 && statusCode < 300) {
        if (!noConsole) {
          
        }
        if (data.code === -1) {
          Taro.showToast({
            title: `${res.data.subMsg}~` || res.data.code,
            icon: 'none',
            mask: true,
          });
        }
        // return data;
        resolve(data)
      } else {
        reject(data)
        throw new Error(`网络请求错误，状态码${statusCode}`);
      }
    })
  })
  
  // return 
}
