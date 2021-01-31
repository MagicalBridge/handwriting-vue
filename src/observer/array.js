// 对于数组的劫持
let oldArrayPrototypeMethods = Array.prototype;

// 做一个继承  相当于 arrayMethods.__proto__ = Array.prototype 
export let arrayMethods = Object.create(oldArrayPrototypeMethods);

// 其实想要做的操作是：我这里包含的方法，使用我的，这里不包含的方，使用原来的
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
  arrayMethods[method] = function (...args) { // args 是参数列表 arr.push(1,2,3)
    // console.log('数组的方法被调用了');
    // 这里使用的是apply方法
    const result = oldArrayPrototypeMethods[method].apply(this, args);
    let inserted;
    // 这部分有些绕，绕的地方主要是两个this指的是啥
    // 这里的this 对应的是当前的数组 __ob__ 属性对应的是实例
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

    if (inserted) {
      // 为了拿到observe 实例上面的 observeArray 方法 
      // 先提前将 这个实例绑定到了数组上面
      inserted = ob.observeArray(inserted); // 给数组新增的值也要进行观测
    }

    return result;
  }
})