import { initMixin } from "./init";

function Vue(options) {
  this._init(options)
}

initMixin(Vue);

// 将这个类导出去
export default Vue;