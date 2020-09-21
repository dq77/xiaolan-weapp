import Request from '@/utils/request.js';


// 订单列表页
export const getorderList = data => Request({
  url: `/user_orders/${data.channel}/list`,
  method: 'GET',
  data,
})

// 订单金额计算
export const priceConfirm = data => Request({
  url: `/user_orders/confirm`,
  method: 'POST',
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

// 订单详情
export const getorederdetail = data => Request({
  url: `/user_orders/order_info/${data.orderNo}`,
  method: 'GET',
  data,
})

// 用户订单统计
export const getorederunpaid = data => Request({
  url: `/user_orders/${data.channel}/count`,
  method: 'GET',
  data,
})

// 查询物流
export const getexpressinfo = data => Request({
  url: `/user_orders/${data.orderNo}/express`,
  method: 'GET',
  data,
})

// 支付接口
export const  payMoney= data => Request({
  url: `/order/${data.orderNo}/downpay`,
  method: 'PUT',
  data,
})


