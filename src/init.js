export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 使用new操作符进行调用, this 指向实例
    const vm = this;
    // 
    vm.$options = options;
  }
}