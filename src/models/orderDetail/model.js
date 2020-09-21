import * as orderDetailApi from './service'

export default {
  namespace: 'orderDetail',
  state: {
    orderDetail:{}, // 订单详情信息
    payBackData: [] // 返现记录详情
  },
  effects: {

    // 取消订单
    * closeOrder({payload,callback}, { call, put }){
      const res = yield call(orderDetailApi.closeOrder, {...payload});
      callback && callback(res);
    },

    // 查看物流
    * getexpressinfo({payload,callback}, { call, put }){
      const res = yield call(orderDetailApi.getexpressinfo, {...payload});
      callback && callback(res);
    },

    // 买断
    * buyoutOrder({payload,callback}, { call, put }){
      const res = yield call(orderDetailApi.buyoutOrder, {...payload});
      callback && callback(res);
    },

    // 订单详情
    * getorederdetail({payload,callback}, { call, put }){
      const { code, data } = yield call(orderDetailApi.getorederdetail, {...payload});
      
      callback && callback();
      if(code===200){
        yield put({
          type:'save',
          payload:{
            orderDetail: data || []
          }
        })
      }
    },
    * getReturnDetail({payload, callback}, {call, put}) {
      const { code, data } = yield call(orderDetailApi.getReturnDetail, {...payload});
      callback && callback(data);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            payBackData: data || []
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
