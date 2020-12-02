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
  console.log('开始标签 ——————————————————');
  console.log(tagName);
  console.log(attrs);
}

// 处理结束标签
function end(tagName) {
  console.log('结束标签 ————————————————————');
  console.log(tagName);
}

// 处理文本
function chars(text) {
  console.log('文本————————————————————');
  console.log(text);
}

function parseHTML(html) {
  while (html) { // 只要html不为空字符串就一直解析
    // 首先看看标签是不是以尖角号开头的
    let textend = html.indexOf('<');
    // 使用 indexOf 判断 如果是0 说明确实是 以 <开头的
    if (textend === 0) {
      // 肯定是标签之后，就开始匹配开始标签
      const startTagMatch  = parseStartTag(); // 这就是开始标签匹配的结果
      if(startTagMatch) {
        start(startTagMatch.tagName,startTagMatch.attrs);
        // 匹配完开始标签 需要进行下一轮的匹配
        continue;
      };

      // 开始匹配结束标签
      const endTagMatch = html.match(endTag);
      if(endTagMatch) {
        // 同样的匹配到的标签删除掉。
        advance(endTagMatch[0].length)
        end(endTagMatch[1]);
        // 结束标签匹配完成就执行下一轮的匹配。
        continue
      }
    }
    // 如果在下一个 < 的索引是大于0 的说明 第一个 开始标签匹配完之后到第二个开始标签
    // 中间的部分是有文本的。
    let text;
    if(textend > 0) {
      text = html.substring(0,textend); // substring 这个api的特点是不是包含头部而不包含尾部呢 这个需要确认一下。
    }
    // 如果text 存在说明解析到了文本
    if(text) {
      advance(text.length); // 继续截取 html 
      chars(text)
      // console.log(html); // <div id="my">hello {{name}}<span>world</span></div></div>
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
      // 传入的这个是 <div 的长度删除开始标签
      advance(start[0].length);

      // console.log(html);

      // 开始匹配属性，这个属性可能有多个，所以这里使用while循环
      // 循环的条件是 不是结尾标签，且属性还没有匹配完毕
      // 这种写法还是第一次看见
      let end;
      let attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 根据正则匹配的规则能够将 属性进行分组
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        // 匹配完毕属性之后继续前进，前进多少呢，当前匹配字符串的第0个的length;
        advance(attr[0].length);
        // console.log(html);
      }
      // 循环完毕属性之后 还会有一个结束标签 我们也要将结束标签去掉
      if(end) {
        // 如果哦结束标签存在的话,将结束标签也去掉。
        advance(end[0].length);
        return match // 将 match的结果返回出去,开头的标签匹配宣告结束。
      }
      console.log(html);
    }

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