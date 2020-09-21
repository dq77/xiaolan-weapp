import * as searchResultApi from './service';

export default {
  namespace: 'searchResult',
  state: {
    goodsList: [],
    isLast:0,
    page:1,
    pageSize:10
  },

  effects: {

    * getGoodslistByKeyWorld({ payload, callback }, { call, put, select }) {
      
      const { page,pageSize,goodsList,isLast } = yield select(state => state.home)
      
      // 首先获取当前的默认分类id并且是否最后一页的数据
      // 先判断当前的默认分类id 和 当前传入的分类id 是否一致并且是否最后一页
      const DATA = Object.assign({
        page,
        pageSize
      },payload);

      const { code, data } = yield call(searchResultApi.getGoodsList, { ...DATA });

      

      callback && callback(data);
      // let newGoodsList = goodsList.concat(data.list);
      let newGoodsList = [...goodsList, ...data.list];

      
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
