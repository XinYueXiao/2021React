# React元素只读性
> Object.freeze方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。[Object.freeze() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
```js
let element = { name: '邓立' }
Object.freeze(element)
element.sex = '男'
console.log(element);
```
- Object.freeze()原理
```js
Object.defineProperties(Object, 'freeze', {//数据劫持
    value: function (obj) {
        var i;
        for (i in object) {//遍历属性和方法
            if (Object.hasOwnProperty(i)) {
                Object.defineProperty(obj, i, {//数据劫持
                    writable: false//把所有属性改为不可修改 只读
                })
            }
        }
        Object.seal(obj)//让此对象不能添加额外的属性
    }
})
```
> 使用相关函数解释
- `Object.defineProperties` 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。[Object.defineProperties | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
-  `hasOwnProperty()` 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。[hasOwnProperty() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
- `Object.seal()` 方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。[Object.seal() | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
# JSX转换
> React 17 之前会使用 `React.createElement()` 进行转换，React17之则引用了新的jsx处理转换方法
- 源代码
```js
import React from 'react';
function App() {
  return <p>Hello World</p>;
}
```
- React16 转换
```js
import React from 'react';

function App() {
  return React.createElement('p', null, 'Hello world');
}
```
- React17 转换
```js
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('p', { children: 'Hello world' });
}
```
- 想使用之前的方式转换需要在`package.json`里设置
```json
"scripts": {
    "start": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts start",
    "build": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts build",
    "test": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts test",
    "eject": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts eject"
  },
```
# React源码解析
## 页面结构
```js
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
ReactDOM.render(
  <ReactTest name='前端了了liaoliao' />,
  document.getElementById('root')
);
```
### 效果展示
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88187dd70d89478494917aeaad411e38~tplv-k3u1fbpfcp-watermark.image)
## React之createElement源码分析
>`React.createElement('p', null, 'Hello world')`通过传递的数据，转成树形数据（即虚拟DOM）的函数
```js
/**
 * 
 * @param {*} type 元素类型
 * @param {*} config 元素配置
 * @param {*} children 子类信息
 */
function createElement(type, config, children) {
    let props = { ...config }
    if (arguments.length > 3) {
    	//截取有效数据
        children = Array.prototype.slice.call(arguments, 2)
    }
    props.children = children
    return {
        type,
        props
    }
}
const React = { createElement }
export default React 
```
## ReactDOM之render源码解析
> 想要了解render源码，必须清楚render的目的是把虚拟dom转换为真实DOM的过程。
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e95e1a107d65429b98050ce54b053743~tplv-k3u1fbpfcp-watermark.image)
```js
/**
 * 1.把vdom（虚拟DOM）变成真实DOM dom
 * 2.把虚拟DOM上的属性更新（同步）到dom上
 * 3.把此虚拟DOM的儿子们也都变成真实DOM挂载到自己的dom上dom.appendChlid
 * 4.把自己挂载到容器上
 * @param {*} vdom 要渲染的虚拟DOM
 * @param {*} container 要把虚拟DOM转换真实DOM并插入到容器中去
 */
function render(vdom, container) {
    const dom = createDOM(vdom)
    container.appendChild(dom)
}
/**
 * 把虚拟DOM变成真实DOM
 * @param {*} vdom 
 */
function createDOM(vdom) {
    //如果是数字或者字符串，就直接返回文本节点
    if (typeof vdom === 'number' || typeof vdom === 'string') {
        return document.createTextNode(vdom)
    }
    //否则就是一个虚拟DOM对象，即React元素
    let { type, props } = vdom
    let dom = null
    if (typeof type === 'function') {//自定义函数组件
        return momentFunctionComponent(vdom)
    } else {
        if (type) {//原生
            dom = document.createElement(type)
        }
    }
    //使用虚拟DOM的属性更新刚创建出来的真实DOM的属性
    updateProps(dom, props)
    //在这里处理props.children属性
    if (props && props.children) {
        if (typeof props.children === 'string' || typeof props.children === 'number') {
            //如果只有一个子类，并且是数字或者字符串
            dom.textContent = props.children
        } else if (typeof props.children === 'object' && props.children.type) {
            //如果只有一个子类，并且是虚拟dom元素
            render(props.children, dom)
            //如果是数组
        } else if (Array.isArray(props.children)) {
            reconcileChildren(props.children, dom)
        } else {
            document.textContent = props.children ? props.children.toString() : ''
        }
    }
    // vdom.dom = dom
    return dom
}
/**
 * 把一个类型为自定义函数组件的虚拟DOM转换为真实DOM并返回
 * @param {*} vdom 类型为自定义函数组件的虚拟DOM
 */
function momentFunctionComponent(vdom) {
    let { type: FunctionComponent, props } = vdom
    let renderVdom = FunctionComponent(props)
    return createDOM(renderVdom)
}
/**
 * 遍历数组
 * @param {*} childrenVdom 子类们的虚拟dom
 * @param {*} parentDOM 父类的真实DOM
 */
function reconcileChildren(childrenVdom, parentDOM) {
    for (let i = 0; i < childrenVdom.length; i++) {
        let childVdom = createDOM(childrenVdom[i])
        render(childVdom, parentDOM)
    }
}
/**
 * 使用虚拟DOM的属性更新刚创建出来的真实DOM的属性
 * @param {*} dom 真实DOM
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, newProps) {
    for (let key in newProps) {
        if (key === 'children') continue;
        if (key === 'style') {
            let styleObj = newProps.style
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        } else {//js支持dom.title='设置'
            dom[key] = newProps[key]
        }
    }
}
const ReactDOM = { render }
export default ReactDOM
```
