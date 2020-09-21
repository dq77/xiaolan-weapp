import Request from '@/utils/request.js';

// 获取优惠券详情
export const getCouponslist = data => Request({
  url: `/user_coupon/my_coupons/${data.channel}/${data.status}`,
  method: 'GET',
  data,
})


// 分期详情(续租)
export const getreletGoodBill = data => Request({
  url: `/client/xuzu/order/${data.orderNo}/bill/amount`,
  method: 'GET',
  data,
})

// 分期详情(正常订单)
export const getBillAmout = data => Request({
  url: `/client/order/bill/amount`,
  method: 'GET',
  data,
})

// 获取押金 最优优惠卷  应付押金
export const getConfirmData = data => Request({
  url: `/user_orders/V3/confirm`,
  method: 'POST',
  data,
})



// 下单
export const createOrder = data => Request({
  url: `/user_orders/create`,
  method: 'POST',
  data,
})

// 买断订单
export const buyoutOrder = data => Request({
  url: `/user_orders/buyout`,
  method: 'POST',
  data,
})

// 续租订单
export const renewalOrder = data => Request({
  url: `/user_orders/renewal`,
  method: 'POST',
  data,
})
