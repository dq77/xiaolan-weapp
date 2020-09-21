import Request from '@/utils/request.js';


// 订单金额计算
export const getBill = data => Request({
  url: `/client/order/${data.orderNo}/bill`,
  method: 'GET',
  data,
})