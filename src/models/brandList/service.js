import Request from '@/utils/request.js';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});

/**
 * 获取品牌列表
 * @param {*} data 
 */
export const getBrandList = data => Request({
  url:'/goods/brand/client/brand_list',
  method:'GET',
  data
})
