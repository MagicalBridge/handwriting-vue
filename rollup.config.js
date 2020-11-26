import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 入口配置, 以这个入口打包。
  output: {
    format: 'umd', // 模块化的类型 这里使用umd的规范
    name: 'Vue', // 全局变量的名字
    file: 'dist/umd/vue.js',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_module/**' // 对于node_module 中的文件不做转义
    }),
    serve({
      open: true, // 是否打开浏览器
      port: 9000, // 端口
      contentBase: '', // 空字符串表示当前目录
      openPage: '/index.html' // 打开的页面是是
    })
  ]
}