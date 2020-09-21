import * as homeApi from './service';

export default {
  namespace: 'home',
  state: {
    title: '啦啦啦',
    banner: [],
    brand:[],
    navList:[],
    selections:[],
    categoryList: [{title:'推荐'}],
    goodsList: [],
    defaultCategory:'',
    isLast:0,
    page:1,
    pageSize:10,
    showPopup: false, // 首页弹窗标志
    popupData: {}, // 首页弹窗数据
  },
  effects: {

    * getBanner({ payload, callback }, { call, put }) {
      const { code, data } = yield call(homeApi.getBanner, { ...payload });
      callback && callback(data);
      if (code === 200) {
        yield put({
          type: 'save',
          payload: {
            banner: data
          }
        })
      }
    },

    * getNavList({ payload, callback }, { call, put}){
      const { code, data} = yield call(homeApi.getNavList,{...payload});
      callback && callback(data);
      if(code === 200){
        yield put({
          type: 'makeNavListObj',
          payload : {
            navList:data
          }
        })
      }
    },

    * getBrand({payload,callback},{call,put}){
      const { code, data} = yield call(homeApi.getBrand, { ...payload });
      callback && callback(data);
      if(code === 200){
        yield put({
          type:'save',
          payload:{
            brand:data.list
          }
        })
      }
    },

    * getSelection({payload,callback},{call,put}){
      const { code, data } = yield call(homeApi.getSelection, { ...payload });
      callback && callback(data);
      if(code === 200 ){
        yield put({
          type:'save',
          payload:{
            selections:data
          }
        })
      }
    },

    * getCategoryByChannel({ payload, callback }, { call, put }) {
      const { code, data } = yield call(homeApi.getChannelCategoryList, { ...payload });
      if (code === 200) {
        yield put({
          type: 'makeCategoryObj',
          payload: {
            categoryList: data
          }
        })
      }
      callback && callback(data);
    },

    * getGoodslistByChannel({ payload, callback }, { call, put, select }) { 
      
      const { code, data } = yield call(homeApi.getGoodsList, { ...payload });
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

    * getGoodslistByChannelLoadMore({ payload, callback }, { call, put, select }) {
      
      
      const { defaultCategory } = yield select(state => state.home)
      if(defaultCategory !== '' && defaultCategory !== payload.channelCategoryId){
        
        yield put({
          type:'save',
          payload:{
            defaultCategory:payload.channelCategoryId,
            goodsList:[]
          }
        })  // 设置当前请求的类目ID
      }

      const { page,pageSize,goodsList,isLast } = yield select(state => state.home)
      // 首先获取当前的默认分类id并且是否最后一页的数据
      // 先判断当前的默认分类id 和 当前传入的分类id 是否一致并且是否最后一页
      const DATA = Object.assign({
        page,
        pageSize
      },payload);

      
      const { code, data } = yield call(homeApi.getGoodsList, { ...DATA });
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
    },

    // 获取首页弹窗
    * getPopup({ payload, callback}, {call, put}) {
      const { code, data } = yield call(homeApi.getPopup, { ...payload })
      if (code === 200 && data && data.imgUrl) {
        yield put({
          type: 'save',
          payload: {
            popupData: data,
            showPopup: true
          }
        })
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    makeNavListObj(state, { payload }){
      
      if(payload.navList && payload.navList.length > 0){
        for (let index = 0,length = payload.navList.length; index < length; index++) {
          payload.navList[index].value = payload.navList[index].name;
          payload.navList[index].image = payload.navList[index].img;
        }
      }
      return { ...state, ...payload };
    },

    makeCategoryObj(state,{payload}){

      if(payload.categoryList && payload.categoryList.length > 0){
        for (let index = 0; index < payload.categoryList.length; index++) {
          payload.categoryList[index].title = payload.categoryList[index].name;
        }
      }
      return { ...state, ...payload };
    }
  },
};
