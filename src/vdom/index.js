export function createElement(tag, data = {}, ...children) {
  // console.log(arguments)
  return vnode(tag, data, data.key, children)
}

export function createTextElement(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

/**
 * 产生虚拟节点
 * @param {*} tag 
 * @param {*} data 
 * @param {*} key 
 * @param {*} children 
 * @param {*} text 
 */
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}

export function patch(oldVnode, vnode) {
  // console.log(oldVnode);
  // console.log(vnode);
  // 将虚拟节点转化为真实节点
  let el = createEle(vnode) // 产生真实的dom
  let parentElement = oldVnode.parentNode // 获取老的app的父亲 body
  parentElement.insertBefore(el, oldVnode.nextsibling); // 当前的真实元素插入到app后面
  // 删除老的子节点
  parentElement.removeChild(oldVnode)
}

function createEle(vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag === "string") { // 创建元素放在vnode.el 上
    vnode.el = document.createElement(tag);
    children.forEach(child => { // 遍历儿子，将儿子的渲染结果放进父亲中
      vnode.el.appendChild(createEle(child))
    })
  } else { // 创建文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
