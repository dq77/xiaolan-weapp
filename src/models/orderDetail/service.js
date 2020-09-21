import Request from '@/utils/request.js';

// 订单详情
export const getorederdetail = data => Request({
  url: `/user_orders/V2/order_info/${data.orderNo}`,
  method: 'GET',
  data,
})

// 用户确认收货
export const receiveGoods = data => Request({
  url: `/user_orders/confirm/${data.orderNo}`,
  method: 'GET',
  data,
})

// 下单
export const placeOrder = data => Request({
  url: `/user_orders/create`,
  method: 'POST',
  data,
})

// 查询物流
export const getexpressinfo = data => Request({
  url: `/user_orders/${data.orderNo}/express`,
  method: 'GET',
  data,
})

// 取消订单
export const closeOrder = data => Request({
  url: `/user_orders/${data.orderNo}/close`,
  method: 'GET',
  data,
})


// 买断订单
export const buyoutOrder = data => Request({
  url: `/user_orders/buyout`,
  method: 'GET',
  data,
})
// 查看订单的返现记录
export const getReturnDetail = data =>Request ({
  url: `/client/order/${data.orderNo}/return/money`,
  method: 'GET',
})