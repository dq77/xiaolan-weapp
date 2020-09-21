import * as logisticsApi from './service';

export default {
  namespace: 'logistics',
  state: {
    
  },

  effects: {
    * getexpressinfo({payload,callback}, { call, put }){
      const res = yield call(logisticsApi.getexpressinfo, {...payload});
      callback && callback(res);

    }
  },

  reducers: {
    save(state, { payload }) {
      
      return { ...state, ...payload };
    },
  },
};
