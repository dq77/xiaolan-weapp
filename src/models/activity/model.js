import * as activityApi from './service';

export default {
  namespace: 'activity',
  state: {
    activeContent:''
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(activityApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },

    * getActiveContent ({payload,callback}, { call, put}){

      const { code, data} = yield call(activityApi.getActiveContent,{ ...payload});
      callback && callback(data);
      if(code === 200){
        yield put({
          type:'save',
          payload:{
            activeContent: data
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
