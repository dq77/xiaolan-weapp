import * as orderListApi from './service'

export default {
  namespace: 'orderList',
  state: {
    tabData: [],
    isLast: true, // 是否最后一页
    unpidBadge: '', // 待支付订单数量
    page: 1
  },
  effects: {
    // 查询列表数据
    *fetchorderList({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderListApi.getorderList, { ...payload })

      callback && callback(data.list)
      if (code === 200) {
        yield put({
          type: 'concatData',
          payload: {
            page: data.page,
            tabData: data.list,
            isLast: data.isLast ? true : false
          }
        })
      }
    },

    // 订单徽标
    *getorederunpaid({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderListApi.getorederunpaid, { ...payload })
      const num = data.map(item => item.num)
      callback && callback()

      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            unpidBadge: num
          }
        })
      }
    },

    // 查询订单下的所有物流订单
    *getexpressinfo({ payload, callback }, { call }) {
      const res = yield call(orderListApi.getexpressinfo, { ...payload })
      callback && callback(res)
    },

    // 确认收货
    *receiveGoods({ payload, callback }, { call }) {
      const res = yield call(orderListApi.receiveGoods, { ...payload })
      callback && callback(res)
    },

    // 支付
    *payMoney({ payload, callback }, { call }) {
      const res = yield call(orderListApi.payMoney, { ...payload })
      callback && callback(res)
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },

    concatData(state, { payload }) {
      return {
        ...state,
        ...payload,
        tabData: payload.page === 1 ? payload.tabData : state.tabData.concat(payload.tabData)
      }
    }
  }
}
