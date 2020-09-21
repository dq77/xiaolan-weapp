import * as billApi from './service';

export default {
  namespace: 'bill',
  state: {
    billData:{}
  },
  effects:{
    * getBill({payload,callback}, { call, put }){
      const {code, data} = yield call(billApi.getBill, {...payload});
      callback && callback();
      if(code === 200){
        yield put({
          type: 'save',
          payload: {
            billData: data
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