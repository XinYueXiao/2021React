import { createDOM } from './react-dom'
class Component {
    static isReactComponent = true
    constructor(props) {
        this.props = props
        this.state = {}
    }
    /**
     * 操作的state
     * @param {*} partialState 
     */
    setState(partialState) {
        let state = this.state
        this.state = { ...state, ...partialState }
        let newVdom = this.render()//调取子类的render方法
        updateClassComponent(this, newVdom)
    }
}
/**
 * 
 * @param {*} classInstance 这个类上次渲染出来的真实DOM
 * @param {*} newVdom 
 */
function updateClassComponent(classInstance, newVdom) {
    let oldDOM = classInstance.dom
    let newDOM = createDOM(newVdom)
    oldDOM.parentNode.replaceChild(newDOM, oldDOM)
    classInstance.dom = newDOM
}
export default Component