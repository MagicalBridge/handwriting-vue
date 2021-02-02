import { generate } from "./generate";
import { parseHTML } from "./parse";

/**
 * 编译函数 接收一个字符串
 * @param {*} template string
 */
export function compileToFunctions(template) {
  // console.log(template);
  // => 将 html字符串变成render函数呢？

  // 1、需要将 html 代码转换成 “ast” 语法树。可以用ast来描述语言本身
  // const a = 1; 如何用ast来描述这一句话呢
  // {
  //   indentifier: const 使用const声明
  //   name: a
  //   value: 1
  // }
  // 这里需要有一个区分：虚拟dom 是用来描述节点的 而ast可以用来描述语言本身
  // 前端需要掌握的数据结构 （树）
  let ast = parseHTML(template); // 将template 转化成ast语法树
  // 2、通过这颗树 重新生成代码。
  // console.log(ast);
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