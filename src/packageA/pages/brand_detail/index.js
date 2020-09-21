import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import getChannel from '@/utils/channel';
import { getWindowHeight } from '@/utils/style';
import GoodGrid from '@/components/GoodGrid/index'

@connect(({brand_detail}) => ({
  ...brand_detail,
}))
export default class Brand_detail extends Component {
  config = {
    navigationBarTitleText: '品牌详情',
  };
  componentDidMount() {
    if (this.$router.params.id) {
      this.props.dispatch({
        type: 'brand_detail/getDetail',
        payload: {
          id: this.$router.params.id
        }
      });
      
      this.loadMoreBrand();
    }
  }
  componentWillUnmount() {
    
    this.props.dispatch({
      type: 'brand_detail/save',
      payload: {
        isLast: 0,
        page: 1,
        goodsList: []
      }
    })
  }
  // 加载品牌商品
  loadMoreBrand = () => {
    const { page, isLast } = this.props
    
    if(isLast) {
      return
    }
    
    this.props.dispatch({
      type: 'brand_detail/getGoodsList',
      payload: {
        page: page,
        channel: getChannel(),
        brandId: this.$router.params.id,
        pageSize: 6,
      }
    })
  }

  render() {
    const { goodsList, brandDetail,isLast } = this.props;
    
    const height = getWindowHeight(false);
    return (
      <View className="brand_detail-page">
      <ScrollView scrollY onScrollToLower={this.loadMoreBrand} className='scrollview' style={{ height }}>
        <View className='brand-header'>
          <Image src={ brandDetail.picture } className='brand-cover'/>
        </View>
        <View className='brand-slogan'>
          <Image src={ brandDetail.logo } className='brand-logo'/>
          <View>
            <View className='brand-name'>
              <Text>{ brandDetail.name }</Text>
            </View>
            <View className='brand-brief'>
              <Text>{ brandDetail.slogan }</Text>
            </View>
          </View>
        </View>
        <View className='brand-good'>
          <Text className='brand-introduction'>{ brandDetail.detail }</Text>
          <View className='goods-container'>
            <GoodGrid goodDatas={goodsList} isLast={isLast} />
          </View>
          {
            !!isLast && (goodsList.length > 0) && <View className='bottom-line'><Text>我也是有底线的</Text></View>
          }
        </View>
      </ScrollView>
      </View>
    )
  }
}
