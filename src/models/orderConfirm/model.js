import * as orderConfirmApi from './service'
import { unitFilter } from '../../utils/utils'

export default {
  namespace: 'orderConfirm',
  state: {
    radioCouponsData: [],
    hasCoupons: false,
    leaseData: [], // 分期详情(分租赁和售卖)
    deposit: '', // 押金
    payDeposit: '', // 应付押金
    availablePoint: 0, // 兰花豆抵扣
    optimalCoupos: { id: '' }, // 最优
    totalRent: '', // 应付金额
    orderBackVo: {}, // 返现券Vo
    firstPay:'',
    totalDeposit:'',
    freeDeposit:''
  },
  effects: {

    // 获取正常订单分期详情
    *getBillAmout({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderConfirmApi.getBillAmout, {
        ...payload
      })
      callback && callback()
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            leaseData: data
          }
        })
      }
    },

    // 获取续租分期详情
    *getreletGoodBill({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderConfirmApi.getreletGoodBill, {
        ...payload
      })
      callback && callback()
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            leaseData: data
          }
        })
      }
    },

    // 获取押金 最优优惠卷  应付押金
    *getConfirmData({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderConfirmApi.getConfirmData, {
        ...payload
      })
      if (code === 200) {
        callback && callback(data)
        let newData =[]
        newData = data.couponList && data.couponList.map(item => ({
          couponMoney: item.couponMoney,
          label: `${item.couponName} ¥${item.couponMoney}`  ,
          value: item.id,
          discountType: item.discountType,
          desc: item.validStartTime
            ? `有效期：${item.validStartTime}-${item.validEndTime}`
            : `${item.couponTime}${unitFilter(item.couponTimeUnit)}后过期`
        }))
        newData.unshift({ couponMoney: 0, label: '不使用', value: -1})
        yield put({
          type: 'save',
          payload: {
            firstPay: data.firstPay, // 首付金额
            totalDeposit: data.totalDeposit, // 押金
            freight: data.freight || 0, // 运费
            freeDeposit: data.freeDeposit ? data.freeDeposit : undefined, // 京东减免押金
            totalRent: data.totalRent || 0, //
            payDeposit: data.deposit, // 应付押金
            optimalCoupos: data.couponList[0] || {}, // 最佳优惠券
            radioCouponsData: newData, // 优惠券列表
            availablePoint: data.availablePoint || 0,
            orderBackVo: data.orderBackVo || {}, // 返现券Vo
            hasCoupons: data.couponList.length > 0 ? true : false
          }
        })
      }
    },

    // 下单
    *createOrder({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.createOrder, { ...payload })
      callback && callback(res)
    },

    // 买断
    *buyoutOrder({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.buyoutOrder, { ...payload })
      callback && callback(res)
    },

    // 续租
    *renewalOrder({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.renewalOrder, { ...payload })
      callback && callback(res)
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
