import { createElement, createTextElement } from "./vdom/index.js";

export function renderMixin(Vue) {
  Vue.prototype._c = function () { // createElement
    return createElement(...arguments)
  }

  Vue.prototype._v = function (text) { // createTextElement
    return createTextElement(text)
  }

  Vue.prototype._s = function (val) {
    if(typeof val === 'object') {
      return JSON.stringify(val)
    }
    return val
  }
  Vue.prototype._render = function () {
    // 这个_render 方法本质上只做一件事情, 就是执行render方法 生成vode
    const vm = this;
    let render = vm.$options.render; // 这里的render有可能是 转义出来的 也有可能是用户写的
    let vnode = render.call(vm);
    // console.log(vnode)
    return vnode
  }
}