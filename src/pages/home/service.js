import Request from '@/utils/request';

export const homepage = data => Request({
  url: '/homepage-v3',
  method: 'GET',
  data,
});

/**
 * 获取home页banner
 * @param {channel(*string)、categoryId(string)、count(string)} data
 */
export const getBanner = data => Request({
  url:'/goods/banner/client/banner_list',
  method:'GET',
  data
})
/**
 * 获取首页入口导航列表
 * @param {*} data 
 */

export const getNavList = data => Request({
  url:'/goods/nav/client/list',
  method:'GET',
  data
})

/**
 * 进入导航栏
 * @param {*} data 
 */
export const getNavEntry = data => Request({
  url:'/goods/nav/client/entry',
  method:'POST',
  data
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


/**
 * 获取租赁商品
 * @param {*} data [channel、page、pageSize]
 */
 export const getRentGoodsList = data => Request({
   url:`/goods/client/rent_goods_list`,
   method:'GET',
   data
 })


/**
 * 获取售卖商品
 * @param {*} data [channel、page、pageSize]
 */

 export const getSaleGoodsList = data => Request({
   url:`/goods/client/sale_goods_list`,
   method:'GET',
   data
 })

 /**
 * 获取试用商品
 * @param {*} data [channel、page、pageSize]
 */

export const getTryGoodsList = data => Request({
  url:`/goods/client/try_goods_list`,
  method:'GET',
  data
})

/**
 * 获取首页弹窗
 */
export const getPopup = data => Request({
  url: `/goods/pop/client/pop_up_channel/${data.channel}`,
  method: 'POST',
})


