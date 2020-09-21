/*
 * @Description: 
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-06-28 20:02:00
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-06-28 20:48:48
 */ 
import * as activity_return_cashApi from './service';
import Taro from '@tarojs/taro'
export default {
  namespace: 'activity_return_cash',
  state: {
    prizeList: [], // 所有的奖品
    rule: '', // 规则
    goodsSns: [], // 商品no集合
    isLast: 0, // 判断商品列表是否是最后一页
    backPercent: '', // 中奖额度
    payBackId: '', // 中奖的id
    goodsList: [], // 获取的商品列表
    page: 1,
    myReturn: [] // 我的返现记录
  },

  effects: {
    // 获取奖品列表
    * getPizeList({payload, callback}, { call, put }) {
      const { code, data } = yield call(activity_return_cashApi.getPizeList, {...payload});
      if (code === 200) {
        yield put({ 
          type: 'save',
          payload: {
            prizeList: data.list || [],
            rule: data.rule,
            goodsSns: data.goodsSns
          } 
        });
      }
      callback && callback(code, data)
    },
    // // 用户是否存在返现券
    * hadPrize({payload, callback}, {call, put}) {
      const { code, data } = yield call(activity_return_cashApi.hadPrize, {...payload});
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            payBackId: data.id,
            backPercent: data.backPercent
          }
        })
      }
      callback && callback(data)
    },
    // // 获取商品列表
    * getGoodsList({payload, callback}, {call, put, select}) {
      const { code, data } = yield call(activity_return_cashApi.getGoodsList, {...payload});
      const{ goodsList } = yield select(state => state.activity_return_cash)
      if (code === 200) {
        callback && callback(data)
        yield put({
          type: 'save',
          payload: {
            page: data.page,
            goodsList: goodsList.concat(data.list),
            isLast: data.isLast
          }
        })
      }
    },
    // // 用户进行抽奖
    * getPrize({payload, callback}, { call, put }) {
      const { code, data} = yield call(activity_return_cashApi.getPrize, {...payload});
      if (code === 200) {
        callback && callback(data); 
        // yield put({
        //   type: 'save',
        //   payload: {
        //     backPercent: data.backPercent,
        //     payBackId: data.id
        //   }
        // })
      }
    },
    * getMyReturn({payload, callback}, { call, put }) {
      const { code, data } = yield call(activity_return_cashApi.getMyReturn, { ...payload });
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            myReturn: data || []
          }
        })
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
