import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {
  // vm 实例
  // exprOFn vm._update(vm._render())
  // cb 
  constructor(vm, exprOFn, cb, options) {
    this.vm = vm;
    this.exprOFn = exprOFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = []; // watcher 记录有多少个dep依赖它
    this.depsId = new Set(); // 使用set这种数据结构的特性
    // 如果是个函数
    if (typeof exprOFn === 'function') {
      // 将这个函数挂载在一个属性上 这里是将函数挂载到getter上面
      this.getter = exprOFn;
    }
    // new watcher的时候默认会地会调用get方法 get 方法就是执行一下这个渲染方法
    this.get();
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) { // 如果当前不存在这个dep 放进去并且把id放进去
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this); // 将当前的watcher存放进去
    }
  }
  get() {
    // Dep.target = watcher 在dep类上添加一个属性 target 赋值为watcher
    pushTarget(this); // this 代表的是当前watcher实例 
    // 调用 exprOFn表示我们要渲染页面了。
    this.getter();
    popTarget();
  }

  update() {
    // 执行的时候重新调用get方法
    this.get();
  }
}

export default Watcher;