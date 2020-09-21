import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

import menuData from './menu'



export default class Menu extends Component {
  static defaultProps = {
    menuList: [],
    current:1
  }

  handleClick = (id) => {
    this.props.onClick(id)
  }

  componentDidMount(){
    
  }

  render () {
    const { current, menuList } = this.props;

    return (
      <View className='cate-menu'>
        {menuList.map((item) => {
          const active = item.id === current
          return (
            <View
              key={item.id}
              className={classNames('cate-menu__item', active && 'cate-menu__item--active')}
              onClick={this.handleClick.bind(this, item.id)}
            >
              <Text
                className={classNames('cate-menu__item-name', active && 'cate-menu__item-name--active')}
              >
                {item.name}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }
}
