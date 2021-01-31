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

export function isObject(val) {
  return typeof val === 'object' && val !== null
}