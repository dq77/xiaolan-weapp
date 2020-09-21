import Request from '@/utils/request.js';

// 获取返现列表
export const getPizeList = data => Request({
  url: `/user_pay_back/${data.channel}`,
  method: 'GET',
});
// 获取中奖额度
export const getPrize = data => Request({
  url: `/user_pay_back/${data.channel}/${data.payBackId}`,
  method: 'GET',
});
// 用户是否有抽中的返现券
export const hadPrize = data => Request({
  url: `/user_pay_back/show/${data.channel}`,
  method: 'GET',
});
// 获取商品列表
export const getGoodsList = data => Request({
  url: '/goods/client/luck_draw/goods_list',
  method: 'POST',
  data: data
})
// 获取我的返现
export const getMyReturn = data => Request({
  url: `/client/return/money`,
  method: 'GET'
})
