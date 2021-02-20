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
 * 生命周期枚举
 */
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed'
]

/**
 * 策略模式
 */
const strats = {};
// data 如何合并
strats.data = function (parentval, childval) { 
  return childval
}

strats.computed = function () { }

strats.watch = function () { }

/**
 * 合并生命周期的方法
 */
function mergeHook(parentval, childval) {
  if (childval) {
    if (parentval) {
      return parentval.concat(childval)  // 将爸爸和儿子进行拼接
    } else {
      return [childval]; // 将儿子转换为数组
    }
  } else { // 如果儿子没有值直接返回父亲
    return parentval
  }
}

// 调用数组的forEach方法
LIFECYCLE_HOOKS.forEach(hook => {
  // strats.created = mergeHook
  // strats.mounted = mergeHook
  // strats.xxx = mergeHook
  strats[hook] = mergeHook
})

/**
 * 合并配置（其实是两个对象）
 * @param {*} parent 
 * @param {*} child 
 */
export function mergeOptions(parent, child) {
  const options = {};
  // 遍历父亲  父亲有儿子没有
  for (let key in parent) { // 父亲和儿子都有在这里处理
    mergeField(key);
  }

  // 儿子有父亲没有 在这里处理
  for (let key in child) { // 循环儿子
    if (!parent.hasOwnProperty(key)) { // 这个条件还是这样。  
      mergeField(key)
    }
  }

  // 合并字段
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      // todo 默认合并
      options[key] = child[key]
    }
  }
  // 儿子有父亲没有
  return options
}