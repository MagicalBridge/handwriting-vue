// <div id="app" style="color: red"> hello {{name}}<span>hello</span></div>
// render() {
//   return _c('div', { id: 'app', style: { color: 'red' } }, _v('hello' + _s(name)),_c('span',null,_v('hello')))
// }

function genProps() {
   
}
// 语法层面的转义 将dom结构变成js的语法
export function generate(el) {
  // let code = `_c('${el.tag}'),${el.attrs.length ? '' : 'undefined'})`;
  // return code;
}