import Watcher from "./observer/watcher";
import { patch } from "./vdom/index";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // console.log(vnode);
    // 渲染完之后 用创建的元素 替换老的元素
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  callHook(vm, 'beforeMount');
  // 更新函数 数据变化后 会再次调用此函数
  let updateComponent = () => {
    // 调用render函数 生成虚拟dom
    vm._update(vm._render()); // 后续更新可以调用updateComponent方法
  }
  // 创建一个渲染watcher实例 
  let watcher = new Watcher(vm, updateComponent, () => {
    callHook(vm, 'beforeUpdate')
  }, true);
  
  callHook(vm, 'mounted');
  // updateComponent();
}

/**
 * 这个方法就是用来调用生命周期函数的
 * @param {*} vm 
 * @param {*} hook 
 */
export function callHook(vm, hook) {
  const handles = vm.$options[hook]; // 这本身就是一个数组
  if (handles) {
    for (let i = 0; i < handles.length; i++) {
      handles[i].call(vm);  // 更改生命周期中的this 现在明白为什么生命周期中的this 全部指向当前实例了吧 这里使用了call
    }
  }
}