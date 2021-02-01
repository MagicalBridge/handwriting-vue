// _c 类似于react中的 createElement 
// _v 创建虚拟节点
// _s 可以看成是json.stringify();
// render() {
//   return _c('div', 
//              { 
//                id: 'app', 
//                style: { color: 'red' } 
//              }, 
//          _v( 'hello' + _s(name)), _c('span',null, _v('hello'))
//          )
// }

// 生成属性方法 比如说 div中包含 {style: {}} 
function genProps(attrs) {
  // console.log(attrs);
  // [
  //   {name: "id", value: "app"},
  //   {name: "style", value: "color: red"}
  // ]
  let str = '';

  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 对于style标签做特殊处理
    if (attr.name === 'style') {
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
// 语法层面的转义 将dom结构变成js的语法
// 看一下元素里面有没有属性 如果有属性就生成属性。
// 
export function generate(el) {
  // 这里面 el.tag 就是div
  let code = `_c('${el.tag}',
    ${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
  })`;
  return code;
}