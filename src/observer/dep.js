class Dep {
  constructor() {
    this.subs = [];
  }
  depend() {
    this.subs.push(Dep.target);
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