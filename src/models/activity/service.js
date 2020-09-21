import Request from '@/utils/request.js';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});

/**
 * 获取花呗活动页
 * 
 */
export const getHuabeiActive = () => Request({
  url:'/goods/active/client/hua_bei_active',
  method:'GET'
})

/**
 * 获取生活号活动
 * @param {*} data 
 */
export const getActiveContent = data => Request({
  url:'/goods/active/client/life_active',
  method:'GET',
  data
})
