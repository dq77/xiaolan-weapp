import Request from '@/utils/request.js';

// 查询地址列表
export const fetchAddressList = data => Request({
  url: '/users/get_address_list',
  method: 'GET',
  data,
})

// 删除地址
export const deleteAddress = data => Request({
  url: `/users/delete_address/${data.id}`,
  method: 'DELETE',
  data,
})