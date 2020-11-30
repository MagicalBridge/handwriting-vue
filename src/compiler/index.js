// 解析函数 如何解析这种标签
{/* <div>hello <span>world</span></div> */}
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 这个这则匹配的是标签名称 <aa-aa></aa-aa> 类似于这样的东西
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture)); // 标签开头的正则表达式
// var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
// var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
// var comment = /^<!\--/;
// var conditionalComment = /^<!\[/;

function parseHTML(html) {

}

export function compileToFunctions(template) {
  // console.log(template);
  // => 将 html 模板变成render函数
  // 1、需要将 html 代码转换成 “ast” 语法树。 可以用 ast 来描述语言本身
  // 前端需要掌握的数据结构 （树）
  let ast = parseHTML(template); // 将template 转化成ast语法树
  // 2、通过这颗树 重新生成代码。

 }