import * as brand_detailApi from './service';

export default {
  namespace: 'brand_detail',
  state: {
    goodsList: [],
    brandDetail: {},
    isLast: 0,
    page: 1,
    pageSize: 6
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(brand_detailApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
    * getDetail({ payload, callback}, { call, put }) {
      const { code , data } = yield call(brand_detailApi.getBrandDetail, { ...payload })
      if (code === 200 ) {
        
        yield put({
          type: 'save',
          payload: {
            brandDetail: data
          }
        })
      }
    },
    * getGoodsList({ payload, callback }, { call, put, select }) {
      const { page, pageSize, goodsList } = yield select( state => state.brand_detail);
      const DATA =  Object.assign({
        page,
        pageSize
      }, payload)
      const { code, data } = yield call(brand_detailApi.getGoodsList, { ...DATA })
      if (code === 200) {
        let list = goodsList.concat(data.list);
        yield put({
          type: 'save',
          payload: {
            goodsList: list,
            isLast: data.isLast,
            page: data.page + 1
          }
        })
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
