import React from './react'
import ReactDOM from 'react-dom'
/**
 * React 自定义组件
 * 1.自定义的组件首字母大写；
 * 2.组件使用前先定义
 * 3.组件需要返回并且只能返回一个根元素 
 * @param {*} props 
 */
function ReactTest(props) {
  return (<div className='title' style={{ background: 'pink', color: 'purple' }}>
    <span>{props.name}</span>
  </div>)
}
/**
 * 类组件和类组件的更新
 */

ReactDOM.render(
  <ReactTest name='前端了了liaoliao' />,
  document.getElementById('root')
);