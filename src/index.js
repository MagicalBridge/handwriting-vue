import { initMixin } from "./init";

function Vue(options) {
  this._init(options)
}

// 传递进去大Vue的作用是为了在内部添加Vue原型上面的方法
initMixin(Vue);

// 将这个类导出去
export default Vue;