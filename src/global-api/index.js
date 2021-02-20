import { mergeOptions } from "../util";

// 全局api
export function initGlobalApi(Vue) {
  Vue.options = {}; // 定义一个空对象
  Vue.mixin = function (mixin) {
    // 合并对象 先不考虑data method props 先只考虑生命周期
    this.options = mergeOptions(this.options, mixin)

    // console.log(this.options);
  }
}