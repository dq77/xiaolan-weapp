/* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:30  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:30  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:29  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:29  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:29  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:29  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:29  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:29  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:29  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:29  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:28  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:28  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:27  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:27  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:27  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:27  *//* * @Author: zhongwenqiang  * @Date: 2019-05-09 16:45:25  * @Last Modified by:   wenqiang  * @Last Modified time: 2019-05-09 16:45:25  */
import Request from '@/utils/request.js';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});

// 获取品牌详情
export const getBrandDetail = data => Request({
  url: `/goods/brand/client/brand_detail/${data.id}`,
  method: 'GET',
});

// 获取品牌商品列表
export const getGoodsList = data => Request({
  url: `/goods/client/goods_brand_list`,
  method: 'GET',
  data
})