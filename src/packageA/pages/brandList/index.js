import Taro, { Component, showTabBar } from '@tarojs/taro';
import { View, Image, Icon, Text, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtIcon } from 'taro-ui'
import './index.scss';
import { getWindowHeight } from '@/utils/style';

@connect(({brandList}) => ({
  ...brandList,
}))
export default class Brandlist extends Component {
  config = {
    navigationBarTitleText: decodeURI(this.$router.params.pagetitle),
  };
  componentDidMount()  {
    
    this.loadMoreBrand();
  }
  componentWillUnmount() {
    
    this.props.dispatch({
      type: 'brandList/save',
      payload: {
        isLast: 0,
        brandList: [],
        page:1,
      }
    })
  }
  goBrandDetail(item) {
    Taro.navigateTo({
      url: `/packageA/pages/brand_detail/index?id=${item.id}`
    })
  }
  loadMoreBrand = () => {
    const { isLast, page } = this.props
    if (isLast) {
      return
    }
    this.props.dispatch({
      type: 'brandList/getBrandList',
      payload: {
        page: page,
      }
    })
  }

  render() {
    const { brandList, isLast } = this.props;
    const height = getWindowHeight(false);
    return (
      <View className='brandList-page'>
        <ScrollView scrollY scrollTop='30' onScrollToLower={this.loadMoreBrand} className='scrollview' style={{ height }}>
          {
            brandList.map((item) => (
              <View className='brandCard' onClick={this.goBrandDetail.bind(this,item)}  key={item}>
                <Image lazyLoad='true' src={item.picture} className='brandImg' />
                <View className='brandBar'>
                  <View className='brand-text'>
                    <Image src={item.logo} className='brandIcon' />
                    <View className='name-brief'>
                      <View className='brandName'>
                        <Text>{item.name}</Text>
                      </View>
                      <View className='brandBrief'>
                        <Text>{item.slogan}</Text>
                      </View>
                    </View>
                  </View>
                  <AtIcon value='chevron-right' size='10' color='#cccccc'></AtIcon>
                </View>
              </View>
            ))
          }
          {
            !!isLast && brandList.length > 0 && <View className='bottom-text'><Text>我也是有底线的</Text></View>
          }
        </ScrollView>
      </View>
    )
  }
}
