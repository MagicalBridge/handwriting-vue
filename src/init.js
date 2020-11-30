import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 使用new操作符进行调用, this 指向实例 这里将this保存
    // 下来给vm变量
    const vm = this;
    vm.$options = options;
    // 初始化数据
    initState(vm);
  }
}