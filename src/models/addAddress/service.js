import Request from '@/utils/request.js';

// 增加地址
export const saveAddress = data => Request({
  url: '/users/add_address',
  method: 'POST',
  data,
})

// 编辑接口
export const modifyAddress = data => Request({
  url: '/users/modify_address',
  method: 'POST',
  data,
})

// 查询单个用户地址详情
export const getbyAddress = data => Request({
  url: `/users/get_address/${data.id}`,
  method: 'GET',
  data,
})
