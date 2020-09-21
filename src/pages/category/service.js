import Request from '@/utils/request';

export const getChannelCategory = (channel,data) => Request({
  url: `/goods/channel_category/client/list/${channel}`,
  method: 'GET',
  data,
});

export const getGoodsById = (data) => Request({
  url: `/goods/client/goods_list`,
  method: 'POST',
  data,
});


/**
 * 获取用户展示类目列表
 * @param {Object} data [channel(*string)]
 */

export const getChannelCategoryList = data => Request({
  url:`/goods/channel_category/client/list/${data.channel}`,
  method:'GET'
})

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

