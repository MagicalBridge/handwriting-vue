import { initState } from "./state";
import { compileToFunctions } from './compiler/index.js'
import { mountComponent } from "./lifecycle";

// 导出一个方法 初始化混合 表示在vue基础上做一次混合操作
export function initMixin(Vue) {
  // 这里的options是形参
  Vue.prototype._init = function (options) {
    // 使用new操作符进行调用构造函数的时候，原型方法中的this指向当前实例，
    // 这里将this保存下来给vm变量
    const vm = this;
    // 将用户传递进来的配置选项赋值给当前实例的$options属性,保存
    vm.$options = options;
    // 初始化数据 将当前的实例传递进去 数据劫持 
    initState(vm);

    // 如果当前有el属性，说明要渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    };
  }
  // 在原型链上添加 mount 方法  为什么要将模板转换为渲染函数
  // 主要是因为 函数的效率很高呀, 检测到数据变化时候就重新执行一下
  // 函数 当然render 也可以用户自己手动书写 用户手动书写的render方法优先级要高一些
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    // 将这个dom元素获取到 传入
    el = document.querySelector(el);
    vm.$el = el;
    // console.log(el);

    if (!options.render) {
      // 没有render将template转化成render方法 
      let template = options.template;
      if (!template && el) { // 没有template 但是存在 el
        template = el.outerHTML;
        // console.log(template); // <div id="app">{{name}}</div> 这里拿到的其实是一个字符串
      }
      // compileToFunctions 接收一个字符串模板 生成一个render函数
      // 这是单独的一个编译的模块
      const render = compileToFunctions(template);
      // 将生成的render 函数传递给 options 之后实例中可以引用了。
      options.render = render;
    }

    // 组件的挂载流程
    mountComponent(vm, el)
    // console.log(options.render);
  }
}