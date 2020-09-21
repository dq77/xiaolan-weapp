import Request from '@/utils/request.js';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});


// 获取商品详情
export const getGoodsDetailById = data => Request({
  url:`/goods/client/goods_detail/${data.no}`,
  method:'GET',
})

/**
 * 获取商品sku详情
 * @param {*} data [no 商品编号]
 */
export const getSkuDetailById = data => Request({
  url:`/goods/sku/client/sku_list/${data.no}`,
  method:'GET',
})


// 获取该商品的可领优惠券
export const getGoodscoupons = data => Request({
  url:`/user_coupon/show_goods_coupons/${data.channel}/${data.spuNo}`,
  method:'GET',
  data,
})


// 领取单张优惠券
export const receiveCoupons = data => Request({
  url:`/user_coupon/collect_coupons/${data.userCouponId}`,
  method:'GET',
  data,
})


// 领取单张优惠券
export const getPoints = data => Request({
  url:`/v1/points/${data.channel}/${data.platform}/users`,
  method:'GET'
})


/**
 * 获取商品库存
 * @param {*} data [skuId *]
 */
export const checkSkuStock = data => Request({
  url:`/goods/sku/client/check_sku_stock/${data.skuId}`,
  method:'GET'
})


