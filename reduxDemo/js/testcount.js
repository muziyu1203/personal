import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Counter from './component/counter'


//����state����������Ĭ��ֵ
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

//ͨ��dispatch ֪ͨreducers state�����˱仯
//ͨ��subscribe ����state�仯 ������ͼ
store.subscribe(render)




//redux ˼��
// 1������store���󣬲�����state�ļ��㺯���������յ�dispatch��������state��֪ͨʱ����state���и��£�
// 2���û�����������state�仯������dispatch����
// 3��dispatch��֪ͨreducersȥ����state
// 4��subscribe��state�仯���¼���������state���º�ִ���¼�����ȥ������ͼ��