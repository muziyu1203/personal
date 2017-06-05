import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Counter from './component/counter'


//计算state，可以设置默认值
const reducers = (state = 0, action) => {
  switch (action.type) {
    case 'plus':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

const store = createStore(reducers)
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
  <Counter
    value={store.getState()}
    onIncrement={() => store.dispatch({ type: 'plus' })}
    onDecrement={() => store.dispatch({ type: 'minus' })}  />, rootEl )

render()

//通过dispatch 通知reducers state发生了变化
//通过subscribe 监听state变化 更新视图
store.subscribe(render)




//redux 思想
// 1、创建store对象，并传入state的计算函数（当接收到dispatch发来更新state的通知时，对state进行更新）
// 2、用户交互，触发state变化，调用dispatch函数
// 3、dispatch会通知reducers去更新state
// 4、subscribe绑定state变化的事件监听，当state更新后执行事件函数去更新视图。