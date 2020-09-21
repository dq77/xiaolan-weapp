import * as vipApi from './service';

export default {
  namespace: 'vip',
  state: {
    goodsList: [],
    isLast:0,
    page:1,
    pageSize:10,
  },
  effects: {

    * getVipInfo({ payload, callback }, { call, put, select }) {
      const res = yield call(vipApi.getVipInfo, { ...payload });
      callback && callback(res);
      // if (code === 200) {
      //   yield put({
      //     type: 'save',
      //     payload: {
      //       goodsList: data.list
      //     }
      //   })
      // }
    },

    * signIn({ payload, callback }, { call, put, select }) {
      const res = yield call(vipApi.signIn, { ...payload });
      callback && callback(res);
    },

    * getDetail({ payload, callback }, { call, put, select }) {
      const res = yield call(vipApi.getDetail, { ...payload });
      callback && callback(res);
    },

    * getVipGoods({ payload, callback }, { call, put, select }) {
      const { code, data } = yield call(vipApi.getGoodsList, { ...payload });
      callback && callback(data);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            page:data.page,
            isLast:data.isLast,
            goodsList: data.list
          }
        })
      }
    },

    * getVipGoodsLoadMore({ payload, callback }, { call, put, select }) {
      const { page,pageSize,goodsList,isLast } = yield select(state => state.vip)
      const DATA = Object.assign({ page, pageSize }, payload);
      const { code, data } = yield call(vipApi.getGoodsList, { ...DATA });
      callback && callback(data);
      // let newGoodsList = goodsList.concat(data.list);
      let newGoodsList =[]
      if(payload.page === 1){
        newGoodsList = [...data.list];
      } else {
        newGoodsList = [...goodsList, ...data.list];
      }
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            page:data.page,
            isLast:data.isLast,
            goodsList: newGoodsList
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
