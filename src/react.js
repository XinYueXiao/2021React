/**
 * 
 * @param {*} type 元素类型
 * @param {*} config 元素配置
 * @param {*} children 子类信息
 */
function createElement(type, config, children) {
    let props = { ...config }
    if (arguments.length > 3) {
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