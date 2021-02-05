// 我们在实际使用的时候 希望用户能够直接使用
// 数据而不是通过 vm._data
export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]; // vm._data.a
    },
    set() {
      vm[data][key] = newValue; // vm._data.a = 100;
    }
  })
}

/**
 * 判断一个数据是不是对象类型
 * @param {*} val
 * @return 返回一个布尔值
 */
export function isObject(val) {
  return typeof val === 'object' && val !== null
}

/**
 * 合并配置（其实是两个对象）
 * @param {*} parent 
 * @param {*} child 
 */
export function mergeOptions(parent, child) {
  const options = {};
  // 遍历父亲  父亲有父亲没有
  for (let key in parent) { // 父亲和儿子都有在这里处理
    mergeField(key);
  }

  // 儿子有父亲没有 在这里处理
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) { // 这个条件还是这样。  
      mergeField(key)
    }
  }

  function mergeField(key)

  // 儿子有父亲没有
  return options
}