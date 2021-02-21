class Dep {

}


// 这里面是一个多对多的关系 一个属性有一个dep 是用来收集watcher的
// dep 可以存放多个watcher 
// 一个watcher可以对应多个dep

export default Dep