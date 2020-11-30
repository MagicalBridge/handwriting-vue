// 对于数组的劫持
let oldArrayPrototypeMethods = Array.prototype;

// 做一个继承
export let arrayMethods = Object.create(oldArrayPrototypeMethods);

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // console.log('数组的方法被调用了');
    // 这里使用的是apply方法
    const result = oldArrayPrototypeMethods[method].apply(this, args);
    let inserted;
    let ob = this.__ob__; // 这是一个自定义的属性 
    // 对于数组的新增方法 需要做处理
    switch (method) {
      case 'push': // arr.push({a:1},{b:2})
      case 'unshift': // 这两个方法 都是追加，追加的内容可能是对象类型 应该被再次进行劫持
        inserted = args // 将args 赋值给这个需要插入的变量
        break;
      case 'splice': // vue.$set的原理
        inserted = args.slice(2); // arr.splice(0,1,{a:1})
      default:
          break;
    }

    if(inserted) {
      inserted = ob.observeArray(inserted); // 给数组新增的值也要进行观测
    }

    return result;
  }
})