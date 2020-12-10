import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunctions(template) {
  // console.log(template);
  // => 将 html 模板变成render函数
  // 1、需要将 html 代码转换成 “ast” 语法树。 可以用 ast 来描述语言本身
  // 前端需要掌握的数据结构 （树）
  let ast = parseHTML(template); // 将template 转化成ast语法树
  // 2、通过这颗树 重新生成代码。
  console.log(ast);

  // 3、通过这颗树, 重新生成代码
  let code = generate(ast);

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
  console.log(code);
}