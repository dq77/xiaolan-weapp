// import cart from '../packageA/pages/cart/model'
import home from '../pages/home/model';
import user from '../pages/user/model';
import category from '../pages/category/model';
import goods from './goods/model';
import bill from './orderBill/model';
import address from './addAddress/model'
import addressList from './address/model'
import orderConfirm from './orderConfirm/model'
import orderDetail from './orderDetail/model'
import orderList from './orderList/model'
import logistics from './logistics/model'
import payresult from './payResult/model'
import searchResult from './searchResult/model'
import goodsList from './goodsList/model'
import brandList from './brandList/model'
import brandDetail from './brandDetail/model'
import activity from './activity/model'
import returnCash from './activity_return_cash/model'
import vip from './vip/model';
export default [
  // cart,
  home,
  user,
  category,
  goods,
  bill,
  address,
  addressList,
  orderConfirm,  // 订单确认页
  orderDetail,   // 订单详情页
  orderList,     // 订单列表页
  logistics,
  payresult,
  searchResult,  // 搜索结果
  goodsList,     // 首页导航入口商品列表
  brandList,     //品牌列表
  brandDetail, // 品牌详情
  activity,
  returnCash, // 订单返现抽奖活动
  vip // 会员中心
]
