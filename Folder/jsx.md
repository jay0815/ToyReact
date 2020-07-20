# JSX Grammar

> _jsx_ 语法会被 _babel-loader_ 中的 ___@babel/plugin-transform-react-jsx___ 转换为 __ToyReact.createElement__ 方>法

回调方法名「 ___ToyReact.createElement___ 」 由 ___@babel/plugin-transform-react-jsx___ 中的 _flag_「__pragma__」定义。
```javascript

  ...webpack.config.js,
  {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "ToyReact.createElement",
                  // "pragmaFrag": "ToyReact.Fragment"
                },
              ],
            ],
          },
        },
      },
    ]
  }
  ...webpack.config.js,
```
---
__@babel/plugin-transform-react-jsx__ 主要作用为转译jsx内容为 js 函数调用的方式

```javascript
  let a = <div>1</div>;

  let b = <div>
    <span>1</span>
    <span>1</span>
  </div>;

  let c = <div>
    <div>
      1
      <div>1</div>
    </div>
  </div>;

  let myInstance = <MyComponet name='self' id='1'>
    <div>1</div>
  </MyComponet>;

  // --- jsx will convert into js  ----

  let a = ToyReact.createElement('div', null, 1);

  let b = ToyReact.createElement("div", null,
            ToyReact.createElement("span", null, "1"),
            ToyReact.createElement("span", null, "1")
          );

  let c = ToyReact.createElement("div", null,
            ToyReact.createElement("div", null, "1",
              ToyReact.createElement("div", null, "1")
            )
          );

  let myInstance = ToyReact.createElement(MyComponet, {
      name: "self",
      id: "1"
  }, ToyReact.createElement("div", null, "1"));
```
---
__createElement__ 的回调参数
* 回调参数分别为:
  * 第一个参数 ___tagName___ or ___Class___
    * 当标签首字母为小写时，回调为「_tagName_」<code>typeof tagName === 'string'</code>
    * 当标签首字母为大写时，回调为「_Class_」<code>Class instanceof ToyReact.Component</code>
  * 第二个参数 ___attribute___
    *  标签上的属性值
    *  不存在属性值时，此参数为 __null__
  * 第三及以后的参数 ___children___
    * 父级标签 或者 组件 中的嵌套部分
    * 同级时, 以多个 createElement 同时返回
