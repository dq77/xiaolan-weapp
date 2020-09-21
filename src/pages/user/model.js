/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:54:15
 */ 
import * as userApi from './service'
import { setSessionItem, setCookie } from '@/utils/save-token';

export default {
  namespace: 'user',
  state: {
    userInfo: {},
    couponList: [],
    cornerMark: [] // 订单的徽标
  },

  effects: {
    *getCode({ payload, callback }, { call, put }) {
      const response = yield call(userApi.getCode, payload)
      if (response.code == 200) {
        callback && callback(response)
      }
    },
    *register({ payload, callback }, { call, put }) {
      const response = yield call(userApi.register, payload)
      callback && callback(response)
    },
    *login({ payload, callback }, { call, put }) {
      const response = yield call(userApi.login, payload)
      callback && callback(response)
    },
    *codeLogin({ payload, callback }, { call, put }) {
      const response = yield call(userApi.codeLogin, payload)
      callback && callback(response)
    },
    *fetchUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(userApi.getUserInfo, payload)
      callback && callback(response)
      if (response.code == 200) {
        // sessionStorage.setItem('userInfo', JSON.stringify(response.data))
        setSessionItem('userInfo', JSON.stringify(response.data))
        // response.data
        yield put({
          type: 'getInfo',
          payload: response.data
        })
      }
    },
    *infoEdit({ payload, callback }, { call, put }) {
      const response = yield call(userApi.infoEdit, payload)
      callback && callback(response)
    },
    *fuck({ payload, callback }, { call, put }) {
      const response = yield call(userApi.fuck, payload)
      callback && callback(response)
    },
    *editPassword({ payload, callback }, { call, put }) {
      const response = yield call(userApi.editPassword, payload)
      callback && callback(response)
    },
    *getMyCoupon({ payload, callback }, { call, put }) {
      const response = yield call(userApi.getMyCoupon, payload)
      callback()
      if (response.code == 200) {
        yield put({
          type: 'getCoupon',
          payload: response.data || []
        })
      }
    },

    // 京东手机号绑定
    *jdBindPhone({ payload, callback }, { call, put }) {
      const response = yield call(userApi.jdBindPhone, payload)
      callback && callback(response)
    },

    // 京东手机号绑定
    *alipayBindPhone({ payload, callback }, { call, put }) {
      const response = yield call(userApi.alipayBindPhone, payload)
      callback && callback(response)
    },
    // 微信绑定手机号
    * weChatBindPhone({payload, callback}, {call, put}) {
      const response = yield call(userApi.weChatBindPhone, {...payload});
      callback && callback(response);
    },
    // 订单徽标
    *getorederunpaid({ payload, callback }, { call, put }) {
      const { code, data } = yield call(userApi.getorederunpaid, { ...payload })
      callback && callback(code)
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            cornerMark: data
          }
        })
      }
    },
    // 微信获取用户信息
    * weappGetUserInfo({payload, callback}, {call, put}) {
      const {code, data} = yield call(userApi.weChatGetUserInfo, {...payload})
      if (code === 200) {
        // data.userPic = data.wxUserResponse && data.wxUserResponse.avatarUrl ? data.wxUserResponse.avatarUrl : '';
        yield put({
          type: 'getInfo',
          payload: data
          
        })
        setSessionItem('userInfo', JSON.stringify(data))
        data.token && setCookie('Token', data.token)
      }
      callback && callback(code);
    },
    // 上传意见
    *upAddidea({ payload, callback }, { call }) {
      const res = yield call(userApi.upAddidea, { ...payload })
      callback && callback(res)
    },

    // 意见图片上传
    *uploadImg({ payload, callback }, { call }) {
      const res = yield call(userApi.uploadImg, payload)
      callback && callback(res)
    }
  },

  reducers: {
    save(state, { payload }) {
      
      return { ...state, ...payload }
    },
    getInfo(state, payload) {
      return { ...state, userInfo: payload.payload }
    },
    getCoupon(state, payload) {
      return { ...state, couponList: payload.payload }
    }
  }
}
