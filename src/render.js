export function renderMixin(Vue) {
  Vue.prototype._c = function (tag, data, ...children) {
    console.log(tag, data, children);
  }

  Vue.prototype._v = function (text) {
    console.log(text);
  }

  Vue.prototype._s = function (val) {
    console.log(val);
  }
  Vue.prototype._render = function () {
    console.log('_render');
    // 这个_render 方法本质上只做一件事情, 就是执行render方法 生成vode
    const vm = this;
    let render = vm.$options.render; // 这里的render有可能是 转义出来的 也有可能是用户写的
    let vnode = render.call(vm)
    return vnode
  }
}