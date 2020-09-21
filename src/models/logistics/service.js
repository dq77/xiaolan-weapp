import Request from '@/utils/request.js';

// 查询物流
export const getexpressinfo = data => Request({
  url: `/user_orders/${data.expressNo}/express_info`,
  method: 'GET',
  data,
})
