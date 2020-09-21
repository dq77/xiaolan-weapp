import Request from '@/utils/request';


export const getVipInfo = data => Request({
  url:`/v1/activities/${data.channel}/${data.platform}/${data.activityId}/users`,
  method:'GET',
  // data
})

export const signIn = data => Request({
  url:`/v1/activities/${data.channel}/${data.platform}/${data.activityId}/users`,
  method:'POST',
  data
})

export const getDetail = data => Request({
  url:`/v1/points/${data.channel}/${data.platform}/users/pageable/${data.page}-10`,
  method:'GET'
})

/**
 * 获取home 页的品牌列表
 * @param {*} data { page,pagesize}
 */

 export const getBrand = data => Request({
   url:'/goods/brand/client/brand_list',
   method:'GET',
   data
 })

 /**
  * 获取精选速递
  * @param {*} data {channel*,count}
  */

  export const getSelection = data => Request({
    url:'/goods/recommendation/client/list',
    method:'GET',
    data
  })


/**
 *
 * @param {获取商品列表} data
 */

// export const goodlist = data => Request({
//   url:'/goods/management/list',
//   method:'POST',
//   data
// })

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



