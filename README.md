---
# 主题列表：juejin, github, smartblue, cyanosis, channing-cyan, fancy, hydrogen, condensed-night-purple, greenwillow, v-green, vue-pro, healer-readable, mk-cute, jzman, geek-black, awesome-green, qklhk-chocolate
# 贡献主题：https://github.com/xitu/juejin-markdown-themes
theme: geek-black
highlight:
---

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
# React源码解析
## JSX转换
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
## React源码解析
