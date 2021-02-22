import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {
  // vm 实例
  // exprOFn vm._update(vm._render())
  constructor(vm, exprOFn, cb, options) {
    this.vm = vm;
    this.exprOFn = exprOFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    // 如果是个函数
    if(typeof exprOFn === 'function') {
      // 将这个函数挂载在一个属性上
      this.getter = exprOFn;
    }
    // new watcher的时候默认会地会调用get方法
    this.get();
  }
  get() {
    // Dep.target = watcher 在dep类上添加一个属性 target 赋值为watcher
    pushTarget(this); // this 代表的是当前watcher实例 
    // 调用 exprOFn表示我们要渲染页面了。
    this.getter();
    popTarget();
  }
}

export default Watcher;