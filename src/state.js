import { observe } from "./observer/index.js";
import { proxy } from './util.js'

/**
 * vm 指的是当前的vue实例
 * @param {*} vm 
 */
// 初始化数据包含很多的工作 包括初始化 data method props 等
// 挨个进行处理
export function initState(vm) {
  // 将vm中的$options 取出来做一个 赋值给 opts
  const opts = vm.$options;
  // 判断传递进来的options中是否有对应的配置,如果有对应的配置
  // 执行响应的初始化逻辑。每一个组件中都包含有一些配置参数
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
// 
function initProps() { }
function initMethods() { }
/**
 * 初始化数据中心
 * @param {*} vm 
 */
// 这个部分是比较核心的
function initData(vm) {
  // 传递进来的vm中包含data数据
  let data = vm.$options.data;
  // 判断传入的data是不是一个函数，如果是一个函数就将这个函数执行下，将结果返回出去
  // 否则就用原来的data赋值，这里call是为了保证this指向。永远指向当前实例new出来的对象实例
  // 为了让实例能够方便的拿到data将函数执行的结果进行赋值。赋值给 _data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  // 这里设置一个代理 当我们访问 this.xxx 属性的时候其实访问的是data上面的属性
  // vm.xxx === vm._data.xxx 这两种取值方式是等价的
  // 设置值的时候也这样进行操作
  for (let key in data) {
    proxy(vm, '_data', key);
  }
  // 单独将数据响应式的功能提取出来
  observe(data)
}
function initComputed() { }
function initWatch() { }
