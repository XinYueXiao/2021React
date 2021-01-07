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
