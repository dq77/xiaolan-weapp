import * as brandListApi from './service';

export default {
  namespace: 'brandList',
  state: {
    brandList: [],
    isLast: 0,
    page:1,
    pageSize: 4
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(brandListApi.demo, {});
      if (status === 'ok') {
        yield put({
          type: 'save',
          payload: {
            topData: data,
          }
        });
      }
    },

    * getBrandList({ payload, callback }, { call, put, select}) {
      const { page,pageSize, brandList } = yield select(state => state.brandList)
      
      const DATA = Object.assign({
        page,
        pageSize
      },payload);

      const { code, data } = yield call(brandListApi.getBrandList, { ...DATA });
      callback && callback(data);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            brandList: brandList.concat(data.list),
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
