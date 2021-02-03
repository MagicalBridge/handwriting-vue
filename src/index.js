import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
  // 这里的options是实参 
  // new Vue({
  //   data:{

  //   }
  // })
  // 我们在new Vue的时候传入的对象其实是组件的配置
  this._init(options)
}

// 传递进去大Vue的作用是为了在内部添加Vue原型上面的方法 这个函数执行了 就会在
// Vue这个构造函数上添加原型方法, 在最开始学习vue的时候，不太理解为什么要传入这个构造函数本身 
initMixin(Vue);
renderMixin(Vue); // 存放_render
lifecycleMixin(Vue); // _update


// 将这个类导出去
export default Vue;