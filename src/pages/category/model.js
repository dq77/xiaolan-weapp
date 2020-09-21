import * as categoryApi from './service';

export default {
  namespace: 'category',
  state: {
    title:'分类',
    menuList:[],
    goodsList:[],
    banner:'',
    defaultCategory:'',
    isLast:0,
    page:1,
    pageSize:10
  },
  effects: {

    * getmenu({payload,callback},{call,put}){

      const { code, data } = yield call(categoryApi.getChannelCategoryList, { ...payload });
      if (code === 200) {
        yield put({
          type: 'makeCategoryObj',
          payload: {
            menuList:data,
            defaultCategory:data[0].id
          }
        })
      }

      callback && callback(data);

    },



    * getGoodsById({payload,callback},{call,put,select}){

      
      
      const { defaultCategory } = yield select(state => state.category)
      if(payload.loadMore){
        if(defaultCategory !== payload.channelCategoryId){
          yield put({
            type:'save',
            payload:{ 
              defaultCategory:payload.channelCategoryId,
              goodsList:[],
              banner:'',
              page:1
            }
          })  // 设置当前请求的类目ID
        }
      } else {
        yield put({
          type:'save',
          payload:{
            defaultCategory:payload.channelCategoryId,
            goodsList:[],
            banner:'',
            page:1
          }
        })  // 设置当前请求的类目ID
      }
      
      const { page,pageSize,goodsList,isLast } = yield select(state => state.category)
      
      // 首先获取当前的默认分类id并且是否最后一页的数据
      // 先判断当前的默认分类id 和 当前传入的分类id 是否一致并且是否最后一页
      const DATA = Object.assign({
        page,
        pageSize
      },payload);

      const { code, data } = yield call(categoryApi.getGoodsList, { ...DATA });
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
            goodsList: newGoodsList,
            banner:data.list[0]
          }
        })
      }
      callback && callback()
    }
  },
  reducers: {
    save(state, { payload }) {
      return {...state, ...payload};
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
