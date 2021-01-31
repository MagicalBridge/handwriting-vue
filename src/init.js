import { initState } from "./state";
import { compileToFunctions } from './compiler/index.js'

// 导出一个方法 初始化混合 表示在vue基础上做一次混合操作
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 使用new操作符进行调用，原型中this指向实例，这里将this保存下来给vm变量
    const vm = this;
    // 将用户传递进来的配置选项赋值给当前实例的$options属性
    vm.$options = options;
    // 初始化数据 将当前的实例传递进去
    initState(vm);

    // 如果当前有el属性，说明要渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    };
  }
  // 在原型链上添加 mount 方法
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    // 将这个dom元素获取到 传入
    el = document.querySelector(el);
    // console.log(el);

    if (!options.render) {
      // 没有render 将template 转化为 render 
      let template = options.template;
      if (!template && el) { // 没有template 但是存在 el
        template = el.outerHTML;
        // console.log(template); // 这里拿到的其实是一个字符串
      }
      // compileToFunctions 接收一个字符串模板 生成一个render函数
      const render = compileToFunctions(template);
      // 将生成的render 函数传递给 options 之后实例中可以引用了。
      options.render = render;
    }
  }
}