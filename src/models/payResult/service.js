import Request from '@/utils/request.js';

// 签约支付
export const signingPay = data => Request({
  url: `/jdpay/downpay/order`,
  method: 'PUT',
  data,
})

// 支付结果金额查询
export const getpayPrice = data => Request({
  url: `/order/${data.orderNo}/first/amount`,
  method: 'GET',
  data,
})