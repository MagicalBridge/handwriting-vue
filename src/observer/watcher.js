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

    if(typeof exprOFn === 'function') {
      this.getter = exprOFn;
    }
    // new watcher的时候默认会地会调用get方法
    this.get();
  }
  get() {
    // 这里很明显就是执行更新函数
    this.getter();
  }
}

export default Watcher;