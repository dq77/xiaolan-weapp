import * as addressApi from './service';

export default {
  namespace: 'addressList',
  state: {
    
    checkedAddress: ''
  },

  effects: {
    * fetchAddressList({payload,callback}, { call, put }){
      
      const res = yield call(addressApi.fetchAddressList, {...payload});
      
      callback && callback(res);
    },

    * deleteAddress({payload,callback}, { call, put }){
      const res = yield call(addressApi.deleteAddress, {...payload});
      callback && callback(res);
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
    
  },
};
