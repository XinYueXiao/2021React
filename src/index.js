import React from './react'
import ReactDOM from './react-dom'
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
    <span>ced</span>
  </div>)
}
/**
 * 一、类组件和类组件的更新state
 * 1、只可以在构造函数里给this.state赋值
 * 2、定义状态对象
 * 3、属性对象，父组件传递，只读不可修改
 * 二、合成事件和批量更新
 * 1、在React里，事件的更新可能是异步的，是批量的
 * 调用state之后状态并没有立刻更新，而是先缓存起来，等事件函数处理完成后
 * 在进行批量更新，一次更新并重新渲染
 */
class StateTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  clickFunc = () => {
    this.setState({ number: this.state.number + 1 })
    this.setState({ number: this.state.number + 1 })
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.clickFunc}>增加1</button>
      </div>
    );
  }
}
ReactDOM.render(
  <StateTest name='前端了了liaoliao' />,
  document.getElementById('root')
);