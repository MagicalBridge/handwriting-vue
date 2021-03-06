import { isObject } from "../util";
import { arrayMethods } from "./array";
import Dep from "./dep";

// 这个文件是用于观测数据的变化的
class Observer {
  constructor(value) {
    // 这里使用defineProperty 定义一个 __ob__ 属性
    // object.defineProperty 方法会直接在一个对象上定义一个新属性。·
    // 或者修改一个对象的现有属性，并返回此对象。判断一个对象是否被观测过，看它有没有 __ob__ 属性
    // 注意 使用这个方法定义的属性是不会被枚举的到，不可枚举的好处是不会造成死循环
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 属性是否可以枚举，这里写的是不可枚举 循环的时候不会循环到这个属性
      configurable: false,
      value: this // 代表的是当前的 Observer 实例 赋值给 __ob__ 类似于这样 {__ob__: Observer }
    })

    // 这里调用了walk方法，意思是将每一个属性都定义成响应式的。
    if (Array.isArray(value)) { // 对于数组来说需要进行特护处理
      // 调用push shift unshift splice sort reverse pop
      // 这种写法叫做函数劫持、切片编程 高阶函数
      value.__proto__ = arrayMethods;
      // 对于数组来说，里面的元素很可能还是一个对象，这样的话，需要针对这种情况单独处理。
      // 具体做法还是遍历数组 
      this.observeArray(value);
    } else {
      this.walk(value)
    }
  }
  // 观测数组，针对数组中的每一项 调用 observe 方法 observe方法自带类型判断
  // 如果是对象类型才会做观测
  observeArray(value) {
    value.forEach(item => {
      observe(item); // 观测数组中的对象类型
    })
  }
  walk(data) {
    // 因为传入的是一个对象，使用 Object.keys 将其转化为数组
    // 使用 Object.keys 这种方式不会去遍历原型链上的属性
    // 只会拿到自己的私有属性
    let keys = Object.keys(data);
    // 遍历数组 
    keys.forEach((key) => {
      // defineReactive 这个函数vue源码中单独定义在util中 就是做响应式用的
      defineReactive(data, key, data[key]);
    })
  }
}
/**
 * 
 * @param {*} data 定义的对象
 * @param {*} key 定义哪一个key呀
 * @param {*} value key对应的value是什么
 */
function defineReactive(data, key, value) {
  // 这里需要一个递归的调用, 将传入的值再次放入 observe 检测一下。
  // 如果value还是一个对象，继续进行递归响应式。
  observe(value)
  let dep = new Dep(); // 每个属性都有一个dep
  Object.defineProperty(data, key, {
    // 当页面取值的时候，说明这个值被用作页面渲染了, 将这个watcher和这个属性对应起来
    get() {
      if(Dep.target) { // 页面正在渲染 让这个属性记住这个watcher
        dep.depend();  // 
      }
      return value;
    },
    set(newValue) {
      // console.log('用户设置值了');
      if (newValue === value) {
        return
      }
      // 在设置值的时候 有可能设置的还是一个对象，这个时候也需要对设置的值进行响应式的观测
      // vm._data.a = {b:1}
      observe(value)
      // 将新的值赋值给value
      value = newValue;
      // 在取值的时候将这个watcher拿出来执行
      dep.notify();
    }
  })
}

/**
 * 响应式数据的核心是 `new Observer` 类 这点务必需要注意。
 * @param {*} data 
 */
export function observe(data) {
  // 响应式数据是有条件的, 观测的内容必须是一个对象，且不能是null
  // 如果不是对象直接return不做后续处理，这一步的判断非常重要
  // 因为后续会有递归操作的, 递归的终止条件就是走进来的数据是一个基本数据类型
  if (!isObject(data)) {
    return;
  }
  // 这里做一个判断，如果当前的这个数据已经被响应过的话
  // 直接返回就好，不需要重新再响应式一遍。这个是 Observer 这个类中的constructor上
  // 定义的属性，所有被观测的属性，都具有这个属性
  if (data.__ob__) {
    return data;
  }

  // 对于观测数据，这是一个单独的功能，提取成一个类，将内部的一些方法耦合在一起
  return new Observer(data);
}