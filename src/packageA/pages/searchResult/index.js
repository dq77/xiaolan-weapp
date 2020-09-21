import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView,Text } from '@tarojs/components';
import getChannel from '@/utils/channel.js'
import { AtSearchBar, AtTabs, AtTabsPane} from 'taro-ui'
import { connect } from '@tarojs/redux';
import './index.scss';
import ItemsGrid from '@/components/ItemGrid/index'
import { getWindowHeight } from '@/utils/style'


@connect(({searchResult}) => ({
  ...searchResult
}))
export default class Searchresult extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: '',
      loading:false,
      searchResultGoodsData:[],
      isLast:0,    // 0 不是最后一页  1 表示最后一页
      page:1,
      pageSize:10
    }
  }

  config = {
    navigationBarTitleText: '搜索结果页',
  };

  componentWillMount = () => {
    
  }

  componentDidMount = () => {

    
    this.setState({
      value:decodeURI(this.$router.params.keyWords)
    }, ()=> {
      this.searchResultByKeyWorld();
    })
    
  };

  onKeyWorldChange(value) {
    this.setState({
      value: value
    })
  }

  searchResultByKeyWorld = (loadMore = false) => {
    this.props.dispatch({
      type: 'searchResult/getGoodslistByKeyWorld',
      payload:{
        page:this.state.page,
        pageSize:this.state.pageSize,
        channel:getChannel(),
        keyWords:this.state.value
      },
      callback:(data) => {

        let { searchResultGoodsData } = this.state;        
        if(loadMore){
          let goodsList = searchResultGoodsData.concat(data.list)
          this.setState({
            loading:false,
            searchResultGoodsData:goodsList,
            isLast:data.isLast
          })

        } else {
          this.setState({
            loading:false,
            searchResultGoodsData:data.list,
            isLast:data.isLast
          })
        }
      }
    });
  }

  onActionClick() {
    this.setState({
      page:1
    }, () => {
      this.searchResultByKeyWorld();
    })
    // Taro.navigateTo({
    //   url:`/pages/searchResult/index?keyWords=${this.state.value}`
    // })
  }

  loadMoreGoodsData = () => {
    let { isLast,page } = this.state;
    

    if(isLast){
      return
    } else {
      page = page + 1
      this.setState({
        page:page
      } , () => {
        this.searchResultByKeyWorld(true);
      })
    }
  }

  render() {
    const { loading,searchResultGoodsData, isLast } = this.state;
    const height = getWindowHeight();

    
    return (
      <View className='searchResult-page'>
        <View className='search-input'>
          <AtSearchBar
            actionName='搜索'
            value={this.state.value}
            onChange={this.onKeyWorldChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
          />
        </View>

        {loading ?
          <View /> :
          <ScrollView
            scrollY
            className='searchResult-scrollView'
            onScrollToLower={this.loadMoreGoodsData}
            style={{ height }}
          >
            
            <View className='items-grid-view'>
              {
                searchResultGoodsData.length !== 0 ? 
                <ItemsGrid ItemsGridData={searchResultGoodsData} onClick={this.viewGoods} />
                :
                <View className='no-data'> <Text>没有找到商品哦！</Text> </View>
              }
            </View>

            { !!isLast ? <View className='data-tips'><Text>没有更多了·····</Text></View>:<View className='loading-tips'><Text>加载中·······</Text></View>}
          </ScrollView>
        }

      </View>
    )
  }
}
