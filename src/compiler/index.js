// 解析函数 如何解析这种标签
{/* <div>hello <span>world</span></div> */ }
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 这个这则匹配的是标签名称 <aa-aa></aa-aa> 类似于这样的东西
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
const startTagOpen = new RegExp(("^<" + qnameCapture)); // 标签开头的正则表达式
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 处理开始标签 接收两个参数 一个是标签名称，一个是属性。
function start(tagName, attrs) {

}

// 处理结束标签
function end(tagName) {

}

// 处理文本
function chars(text) {

}

function parseHTML(html) {
  while (html) { // 只要html不为空字符串就一直解析
    // 首先看看标签是不是以尖角号开头的
    let textend = html.indexOf('<');
    // 使用 indexOf 判断 如果是0 说明确实是 以 <开头的
    if (textend === 0) {
      // 肯定是标签之后，就开始匹配开始标签
      parseStartTag();
      break;
    }
  }
  // 前进方法, 将匹配到的字符串删除掉，继续匹配后面的内容
  // 
  function advance(n) {
    // 将截取出来的字符串重新赋值给html
    html = html.substring(n);
  }
  //  
  function parseStartTag() {
    // 字符串的match方法 返回的是一个数组
    const start = html.match(startTagOpen);
    if (start) { // 匹配到的数组不为空
      // 创建一个对象
      const match = {
        tagName: start[1],
        attrs: [],
      }

      console.log(match);
    }
    // console.log(start);
  }
}

export function compileToFunctions(template) {
  // console.log(template);
  // => 将 html 模板变成render函数
  // 1、需要将 html 代码转换成 “ast” 语法树。 可以用 ast 来描述语言本身
  // 前端需要掌握的数据结构 （树）
  let ast = parseHTML(template); // 将template 转化成ast语法树
  // 2、通过这颗树 重新生成代码。

}