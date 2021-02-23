let id = 0;
class Dep {
  constructor() {
    this.subs = [];
    this.id = id++;
  }
  depend() {
    // this.subs.push(Dep.target);
    // 我们希望
    // Dep.target 其实就是watcher 
    // 实现的是双向记忆，让watcher记住dep的同时 让dep记住watcher
    Dep.target.addDep(this)
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    // 将watcher 拿出来执行
    this.subs.forEach(watcher => watcher.update());
  }
}


// 这里面是一个多对多的关系 一个属性有一个dep, 这个dep是干嘛的呢？是用来收集watcher的
// dep可以存放多个watcher, 一个watcher可以对应多个dep
Dep.target = null;

export function pushTarget(watcher) {
  Dep.target = watcher;
}

export function popTarget() {
  Dep.target = null;
}

export default Dep