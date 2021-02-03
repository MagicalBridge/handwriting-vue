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
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双大括号
// 生成属性方法 比如说 div中包含 {style: {}} 
/**
 * 这个attrs 中就是一个数组
 * @param {*} attrs 
 */
function genProps(attrs) {
  // [
  //   {name: "id", value: "app"},
  //   {name: "style", value: "color: red"}
  // ]
  // console.log(JSON.stringify(attrs)) 
  // [{"name":"id","value":"app"},{"name":"style","value":"font-size: 16px; background: yellowgreen;"}]
  let str = '';
  for (let i = 0; i < attrs.length; i++) {

    let attr = attrs[i];
    // 对于style标签做特殊处理
    if (attr.name === 'style') {
      let obj = {};
      // attr.value 是一个字符串 "font-size: 16px; background: yellowgreen;"}
      // 先用 ; 分割成了 一个数组
      // ["font-size: 16px", "background: yellowgreen",""]
      attr.value.split(';').forEach(item => {
        // 数组解构的方式
        if (item !== "") { // 如果最后一个属性后面有分号 数组的最后一项就会有一个 空 ”“
          let [key, value] = item.split(':')
          obj[key] = value;
        }
      });
      attr.value = obj;
      // console.log(attr.value) // {font-size: " 16px", " background": " yellowgreen"
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
    // console.log(str) // generate.js:47 id:"app",style:{"font-size":" 16px"," background":" yellowgreen"},
  }
  // slice 方法可以提取字符串的某一个部分，并以新的字符串返回被提取的部分
  // stringObject.slice(start,stop)
  // start 开始位置，从某一个位置开始 
  // stop 结束位置  如果是负数, 意思是从倒着数 返回start 和 stop 中间的部分
  // 如果stop 不写，则返回的是从start 到结束的部分
  return `{${str.slice(0, -1)}}`;
}

function gen(node) {
  if (node.type == 1) {
    return generate(node)
  } else { // 如果是文本 
    let text = node.text; // 获取文本
    // 如果是普通文本
    if (!defaultTagRE.test(text)) { // 如果文本中不包含{{}}
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = []; // 存放每一段代码
    let lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式，需要每次使用前值为0
    let match, index; // 每次匹配到的结果
    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) { // 后面还有一点没完事
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return `_v(${tokens.join('+')})`;
  }
}

function genChildren(el) {
  const children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',') // 将所有转化后的儿子用逗号拼接起来)
  }
}

// 语法层面的转义 将dom结构变成js的语法
// 看一下元素里面有没有属性 如果有属性就生成属性。
export function generate(el) {
  let children = genChildren(el)
  // 这里面 el.tag 就是div 这里在写的时候需要特别注意,很容易写错
  let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${children ? `,${genChildren(el)}` : ''})`;
  return code;
}