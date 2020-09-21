import * as payApi from './service'

export default {
  namespace: 'payResult',
  state: {
    payPrice:'0',
    data:{}
  },
  effects: {

    // 完成签约支付
    * signingMoney({payload,callback}, { call, put }){
      const res = yield call(payApi.signingPay,{...payload})
      callback && callback(res);
    },

    // 查询支付金额
    * getpayPrice({payload,callback}, { call, put }){
      const res = yield call(payApi.getpayPrice,{...payload})
      callback && callback(res);
      if(res.code===200){
        yield put({
          type:'save',
          payload:{
            payPrice:res.data.amountYuan,
            data:res.data
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
