import * as goodsApi from './service'
import { getSkuDetail } from '@/utils/sku.js'

export default {
  namespace: 'goods',
  state: {
    goodsDetailData: {}, // 商品详情
    havedSpec: true,
    skuDetailData: [], // 商品sku详情
    couponsList: [], // 优惠券列表
    selectedGoodsInfo: {
      cnt: 1,
      img: '',
      name: '',
      businessType: 0, // 默认业务类型  0 租赁  20 售卖
      selectedSpecs: [], // 默认已选规格
      selectedPayTypeObj: { name: '一次性支付', value: '1' }, // 默认已选支付方式
      selectedStageObj: {
        // 默认已选租期
        stageValue: {}
      }
    } // 商品名称、商品数量、已选规格、所选租期、押金
  },

  effects: {
    // 获取商品详情
    *getGoogsDetailById({ payload, callback }, { call, put }) {
      const { code, data } = yield call(goodsApi.getGoodsDetailById, {
        ...payload
      })

      callback && callback(data)

      if (code === 200) {
        yield put({
          type: 'goodsDetailSave',
          payload: {
            goodsDetailData: data
          }
        })
      }
    },

    // 根据商品编号获取商品sku详情及对应的租期
    *getGoodsSkuDetailById({ payload, callback }, { call, put, select }) {
      const { code, data } = yield call(goodsApi.getSkuDetailById, {
        ...payload
      })
      callback && callback(data)

      if (code === 200) {
        yield put({
          type: 'skuAndStageDetailSave',
          payload: {
            skuDetailData: data
          }
        })
      }
    },

    *pushState({ payload }, { put, select }) {
      const selectedGoodsInfo = yield select(state => state.goods.selectedGoodsInfo)
      const newSelectedGoodsInfo = Object.assign(selectedGoodsInfo, payload)
      yield put({
        type: 'save',
        payload: {
          selectedGoodsInfo: { ...newSelectedGoodsInfo }
        }
      })
    },

    // 获取商品下所有优惠券
    *getGoodscoupons({ payload, callback }, { call, put }) {
      const { code, data } = yield call(goodsApi.getGoodscoupons, { ...payload })
      callback && callback(data)
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            couponsList: data
          }
        })
      }
    },

    // 领取单张优惠券
    *receiveCoupons({ payload, callback }, { call, put }) {
      const res = yield call(goodsApi.receiveCoupons, { ...payload })
      callback && callback(res)
    },

    // 查询用户兰花豆余额
    *getPoints({ payload, callback }, { call, put }) {
      const res = yield call(goodsApi.getPoints, { ...payload })
      callback && callback(res)
    },

    // 查询sku库存
    *checkSkuStock({ payload, callback }, { call, put }) {
      const { code, data } = yield call(goodsApi.checkSkuStock, { ...payload })
      callback && callback(data)
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            isStock: data
          }
        })
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },

    // 商品详情数据处理
    goodsDetailSave(state, { payload }) {
      const { goodsDetailData } = payload
      const { specificationVOList = [] } = goodsDetailData

      // 为了确保选择规格值的时候数组组装顺序一致提前组装数据格式
      const specMaps = []
      if (specificationVOList.length > 0) {
        specificationVOList.map((item, index) => {
          specMaps[index] = item.specificationKeyVO
          specMaps[index].value = item.specificationValueVOList[0]
        })
        payload.havedSpec = true
      } else {
        payload.havedSpec = false
      }

      let skuDetailObj = getSkuDetail(specMaps)

      // 设置默认的已选规格数据
      const selectedGoodsInfo = {
        cnt: 1,
        name: goodsDetailData.name,
        img: goodsDetailData.pictureList[0],
        businessType: goodsDetailData.businessType,
        alipayCode: goodsDetailData.alipayCode && goodsDetailData.alipayCode, // 支付宝支付使用
        payTypeList: goodsDetailData.payTypeList, // 支付宝支付使用
        skuDetailObj,
        selectedSpecs: specMaps,
        selectedPayTypeObj: { name: '一次性支付', value: '1' },
        selectedStageObj: {
          stageValue: {}
        }
      }
      if (goodsDetailData.specificationVOList.length > 0 &&
        goodsDetailData.specificationVOList[0].specificationValueVOList.length > 0 &&
        goodsDetailData.specificationVOList[0].specificationValueVOList[0].picture
        ) {
        selectedGoodsInfo.img = goodsDetailData.specificationVOList[0].specificationValueVOList[0].picture
      }
      payload.selectedGoodsInfo = selectedGoodsInfo

      return { ...state, ...payload }
    },

    // 租期和规格数据存储及整理
    skuAndStageDetailSave(state, { payload }) {
      const { skuDetailData = [] } = payload
      let { goodsDetailData, selectedGoodsInfo } = state
      const { skuDetailObj } = selectedGoodsInfo
      const { specificationVOList = [] } = goodsDetailData

      if (skuDetailData.length > 0) {
        // 当商品无规格的时候
        if (specificationVOList.length === 0) {
          selectedGoodsInfo.selectedStageObj = skuDetailData[0] || {}
          if (
            selectedGoodsInfo.selectedStageObj.skuStageVOList &&
            selectedGoodsInfo.selectedStageObj.skuStageVOList.length > 0
          ) {
            selectedGoodsInfo.selectedStageObj.stageValue =
              selectedGoodsInfo.selectedStageObj.skuStageVOList[
                selectedGoodsInfo.selectedStageObj.skuStageVOList.length - 1
              ]
          } else {
            selectedGoodsInfo.selectedStageObj.stageValue = {}
          }
        } else {
          const stageItem = skuDetailData.filter(item => item.detail === skuDetailObj.detail)
          selectedGoodsInfo.selectedStageObj = stageItem[0]
          if (
            selectedGoodsInfo.selectedStageObj.skuStageVOList &&
            selectedGoodsInfo.selectedStageObj.skuStageVOList.length > 0
          ) {
            selectedGoodsInfo.selectedStageObj.stageValue =
              selectedGoodsInfo.selectedStageObj.skuStageVOList[
                selectedGoodsInfo.selectedStageObj.skuStageVOList.length - 1
              ]
          } else {
            selectedGoodsInfo.selectedStageObj.stageValue = {}
          }
        }
      }

      payload.selectedGoodsInfo = selectedGoodsInfo

      return { ...state, ...payload }
    }
  }
}
