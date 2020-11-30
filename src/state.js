import { observe } from "./observer/index.js";
import { proxy } from './util.js'

/**
 * vm 指的是当前的vue实例
 * @param {*} vm 
 */
export function initState(vm) {
  const opts = vm.$options;
  // 判断传递进来的options中是否有对应的配置,如果有对应的配置
  // 执行响应的初始化逻辑。
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
function initData(vm) {
  let data = vm.$options.data;
  // 判断传入的data是不是一个函数，如果是一个函数就将这个函数执行下
  // 否则就用原来的额data赋值 这里call 是为了保证this指向。
  // 为了让实例能够拿到data 将函数执行的结果进行赋值。
  vm._data = data = typeof data === 'function' ? data.call(vm) : data;

  // 这里设置一个代理 当我们访问 this.xxx 属性的时候其实访问的是data上面的属性
  for (let key in data) {
    proxy(vm, '_data', key);
  }

  // 单独将数据响应式的功能提取出来
  observe(data)
}
function initComputed() { }
function initWatch() { }
