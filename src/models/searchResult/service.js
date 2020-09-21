import Request from '@/utils/request.js';

 /**
  * 根据渠道、类目id 获取对应的商品列表
  * @param {*} data [channel、keyWords、page、pageSize]
  * {
  *   channel:'',
  *   channelCategoryId:'',
  *   keyWords:'',
  *   page:'',
  *   pageSize:''
  * }
  */
 export const getGoodsList = data => Request({
  url:`/goods/client/goods_list`,
  method:'POST',
  data
})

export const search = {}
