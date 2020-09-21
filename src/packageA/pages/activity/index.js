import Taro, { Component } from '@tarojs/taro';
import { View,Image,Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Base64  from 'base-64';
import './index.scss';
import Loading from '@/components/loading/index'

@connect(({activity}) => ({
  ...activity,
}))
export default class Activity extends Component {
  config = {
    navigationBarTitleText: this.props.activeContent && this.props.activeContent.title,
  };

  state = {
    loadingStatus:true,
    imgContent:'', 
    clentHeight:0
  }

  componentDidMount = () => {
      if(this.$router.params.id){
        this.getActivityContent();
      } else {
        Taro.showToast({
          icon:'none',
          title:'活动地址有误'
        })
      }
  }

  getActivityContent = () => {

    this.props.dispatch({
      type:'activity/getActiveContent',
      payload:{
        activeId:this.$router.params.id
      },
      callback:(data) => {

        
        if(!data.content) return false;
        let baseCode = Base64.decode(data.content);
        let list = baseCode.split('<svg ')[1].split(' ', 2)
        let w = 750
        let h = 4485
        list.forEach(item => {
            let slist = item.split('=')
            if (slist[0].indexOf('width') != -1) {
                w = parseInt(slist[1].substring(1, slist[1].length-1))
            } else if (slist[0].indexOf('height') != -1) {
                h = parseInt(slist[1].substring(1, slist[1].length-1))
            }
        });

        this.clentWidth = document.documentElement.clientWidth //屏幕宽度
        let svgWidth = w / this.clentWidth * w //
        let svgHeight = svgWidth / w * h
        this.clentHeight = h / w * this.clentWidth

        baseCode = baseCode.replace(/<svg/, `<svg viewBox="0 0 ${svgWidth} ${svgHeight}"`)

        this.setState({
          loadingStatus:false,
          clentWidth:this.clentWidth,
          clentHeight:this.clentHeight,
          imgContent: baseCode
        })

      }
    })

  }




  render() {
    const { imgContent, clentHeight, clentWidth } = this.state;

    if (this.state.loadingStatus) {
      return (
        <View className='loading-page'>
          <Loading />
          <Text className='loading-tips-txt'>加载中......</Text>
        </View>
      )
    }
    return (
      <View className='activity-page' style={{height: clentHeight}}>
        <View dangerouslySetInnerHTML={{ __html:  imgContent}} />
      </View>
    )
  }
}
