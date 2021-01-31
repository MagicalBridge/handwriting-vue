import { isObject } from "../util";
import { arrayMethods } from "./array";

// 这个文件是用于观测数据的变化的
class Observer {
  constructor(value) {
    // 这里使用defineProperty 定义一个 __ob__ 属性
    // object.defineProperty 方法会直接在一个对象上定义一个新属性。
    // 或者修改一个对象的现有属性，并返回此对象。
    // 判断一个对象是否被观测过，看它有没有 __ob__ 属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 属性是否可以枚举，这里写的是不可枚举 循环的时候不会循环到这个属性
      configurable: false, // 
      value: this // 
    })


    // 这里调用了walk方法，意思是将每一个属性都定义成 响应式的。
    // 对于数组来说需要进行特护处理
    if (Array.isArray(value)) {
      // 调用push shift unshift splice sort reverse pop
      // 这种写法叫做函数劫持、切片编程
      value.__proto__ = arrayMethods;
      // 对于数组来说，里面的元素很可能还是一个对象，这样的话，需要针对这种情况单独处理。
      this.observeArray(value);
    } else {
      this.walk(value)
    }
  }
  observeArray(value) {
    value.forEach(item => {
      observe(item); // 观测数组中的对象类型
    })
  }
  walk(data) {
    // 因为传入的是一个对象，使用 Object.keys 将其转化为数组
    // 使用 Object.keys 这种方式 不会去遍历原型链 只会拿到私有属性
    let keys = Object.keys(data);
    // 遍历数组
    keys.forEach((key) => {
      // 这个函数vue源码中单独定义在 util 中
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
  // 如果value还是一个对象，继续进行递归响应式
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      // console.log('用户获取值了');
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
      value = newValue;
    }
  })
}

export function observe(data) {
  // 观测的数据是有条件的 观测的内容必须是一个对象，且不能是null
  // 如果不是对象直接return 不做后续处理
  if (!isObject(data)) {
    return;
  }
  // 这里做一个判断，如果当前的这个数据已经被响应过的话
  // 直接返回就好，不需要重新再响应式一遍。
  if (data.__ob__) {
    return data;
  }

  // 对于观测数据，这是一个单独的功能，提取成一个类，将内部的一些方法耦合在一起
  return new Observer(data);
  // console.log(data);
}