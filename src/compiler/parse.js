// 解析函数 如何解析这种标签
{/* <div>hello <span>world</span></div> */ }
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 这个这则匹配的是标签名称 <aa-aa></aa-aa> 类似于这样的东西
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // 用来获取标签名称
const startTagOpen = new RegExp(("^<" + qnameCapture)); // 标签开头的正则表达式
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>")); // y用来匹配闭合标签的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;

// 这里为什么要使用while循环呢,解析完一段就删除，直到字符串为空说明解析完毕
export function parseHTML(html) {
  // 创建AST语法树
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName, // 标签名称
      type: 1, // 元素类型
      children: [], // 孩子列表
      attrs, // 属性集合
      parent: null // 父元素
    }
  }
  // 根标签
  let root;
  // 处理开始标签 接收两个参数 一个是标签名称，一个是属性。
  let currentParent; // 标识当前的父节点
  let stack = [];

  /**
   * 开始标签 标签名称 和属性
   * @param {*} tagName 
   * @param {*} attrs 
   */
  function start(tagName, attrs) {
    // console.log(tagName, attrs, '————————— 开始标签 —————————');
    // 创建一个元素
    let element = createASTElement(tagName, attrs);
    if (!root) { // 如果没有根元素，这个创建的元素就是根元素。
      root = element;
    }
    // 当前解析的标签 保存起来
    currentParent = element;
    // 开头的标签名称 放进栈中
    stack.push(element);
  }

  // 处理结束标签
  function end(tagName) { // 在标签闭合出创建父子关系
    // 结束的时候将最后一个标签取出来
    let element = stack.pop();
    // pop 会改变原数组的长度。
    // 然后取出数组的最后一个当做当前的 父元素
    currentParent = stack[stack.length - 1];

    if (currentParent) { // 标签闭合的时候可以知道这个标签的父亲
      element.parent = currentParent;
      currentParent.children.push(element);
    };

  }

  // 处理文本
  function chars(text) {
    // console.log(text, '————————— 文本标签 —————————');
    text = text.replace(/\s/g, ''); //用正则 将文本标签中的空格去掉
    if (text) { // 去掉空格之后 如果文本还存在
      currentParent.children.push({
        type: 3, // 文本类型
        text
      })
    }
  }

  // 前进方法, 将匹配到的字符串删除掉，继续匹配后面的内容
  // 这个substring方法：用于提取字符串中介于两个指定下标之间的字符
  // stringObject.substring(start, stop)
  // start 这个参数是必须的 一个非负的整数 规定要提取的的子串的第一个字符在stringObject中的位置
  // stop 比要提取的子串的最后一个字符在stringObject中的位置多1 通俗来说 这是包头不包尾
  function advance(n) {
    // 将截取出来的字符串重新赋值给html
    html = html.substring(n);
  }
  // 匹配开始标签
  function parseStartTag() {
    // 字符串的match方法可以在字符串内部检索指定的值，或者找到一个或者多个正则表达式的匹配
    // 这个方法类似于 indexOf 但是它返回固定的值，而不是字符串的位置
    // stringObject.match(searchValue)
    // stringObject.match(regexp)
    // 返回值是存放匹配结果的数组 该数组的内容依赖于 regexp 是否具有全局标志 g
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
      // 循环的条件是 不是闭合标签标签，且属性还没有匹配完毕
      // 这种写法还是第一次看见
      let end;
      let attr;
      // startTagClose 匹配的是闭合标签 attr 匹配的是属性
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
      if (end) { // >
        // 如果哦结束标签存在的话,将结束标签也去掉。
        advance(end[0].length);
        // match 是一个对象
        return match // 将 match的结果返回出去,开头的标签匹配宣告结束。
      }
    }
  }


  while (html) { // 只要html不为空字符串就一直解析
    // 首先看看标签是不是以尖角号开头的
    let textend = html.indexOf('<');
    // 使用 字符串的indexOf方法 判断如果是0 说明确实是 以 <开头的 肯定是个开头标签
    if (textend === 0) { 
      // 肯定是标签之后，就开始匹配开始标签
      const startTagMatch = parseStartTag(); // 这就是开始标签匹配的结果
      if (startTagMatch) { // 这里需要严谨一些 返回的是一个对象肯定是true
        start(startTagMatch.tagName, startTagMatch.attrs);
        // 匹配完开始标签 需要进行下一轮的匹配
        continue;
      };

      // 开始匹配结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
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
    if (textend > 0) {
      // substring 这个api的特点是不是包含头部而不包含尾部呢 这个需要确认一下。
      text = html.substring(0, textend); 
    }
    // 如果text 存在说明解析到了文本
    if (text) {
      advance(text.length); // 继续截取 html 
      chars(text)
      // console.log(html); // <div id="my">hello {{name}}<span>world</span></div></div>
    }
  }
  // 将这个树返回出去
  return root;
}