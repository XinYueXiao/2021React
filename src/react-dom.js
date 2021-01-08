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
export function createDOM(vdom) {
    //如果是数字或者字符串，就直接返回文本节点
    if (typeof vdom === 'number' || typeof vdom === 'string') {
        return document.createTextNode(vdom)
    }
    //否则就是一个虚拟DOM对象，即React元素
    let { type, props } = vdom
    let dom = null
    if (typeof type === 'function') {//自定义函数组件
        if (type.isReactComponent) {//类组件
            return mountClassComponent(vdom)
        } else {//函数组件
            return momentFunctionComponent(vdom)
        }
    } else {
        if (type) {//原生
            dom = document.createElement(type)
        }
    }
    //使用虚拟DOM的属性更新刚创建出来的真实DOM的属性
    updateProps(dom, props)
    //在这里处理props.children属性
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
        console.log('baocuo');
        dom.textContent = props.children ? props.children.toString() : ''
    }
    // vdom.dom = dom
    return dom
}
/**
 * 创建类组件实例
 * 调用类组件实例的render方法获得返回的虚拟DOM（react元素）
 * 把返回的虚拟DOM转成真实DOM进行挂载
 * @param {Component} vdom 类型为类组件的虚拟DOM
 */
function mountClassComponent(vdom) {
    //解构类的定义及类的属性
    let { type, props } = vdom
    //创建类的实例
    let classInstance = new type(props)
    //调用实例的render方法返回要渲染的虚拟DOM对象
    let renderVdom = classInstance.render()
    //根据虚拟DOM对象创建真实DOM对象
    let dom = createDOM(renderVdom)
    //为以后类组件的更新，把真实DOM挂载到了类的实例上
    classInstance.dom = dom
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
        let childVdom = childrenVdom[i]
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
        } else if (key.startsWith('on')) {
            //给真实DOM时间大小写转换onclick
            dom[key.toLocaleLowerCase()] = newProps[key]
        } else {//js支持dom.title='设置'
            dom[key] = newProps[key]
        }
    }
}
const ReactDOM = { render }
export default ReactDOM
