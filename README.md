# ToyReact

## Start
___First___
```javascript
  yarn install
  // --- or ----
  npm install
```
___then___
```javascript
  yarn start
  // --- or ----
  npm start
```
## ToyReactJS

### 基于jsx风格

[JSX Grammar](./Folder/jsx.md)

### How does ToyReact Run in browser
经过 ___webpack___ 中的 ___babel-loader___ 及其插件编译后，代码被转译成了一段由 __eval__ 执行的内容为「[source](./build/buildSource.js)」的指令
```javascript
eval(
  "__webpack_require__.r(__webpack_exports__);
  ... ___describe of function and class___ ...
  var a = ToyReact.createElement(\"div\", null, \"a\");
  var text = \"Hello ToyReact\";
  var MyComponet = function (_ToyReact$Component) { _inherits(MyComponet, _ToyReact$Component);
    var _super = _createSuper(MyComponet);
    function MyComponet() {
     _classCallCheck(this, MyComponet);return _super.apply(this, arguments);
    }
    _createClass(MyComponet,
      [
        {
          key: "render",
          value: function render() {
            return ToyReact.createElement(\"article\", null,
                      ToyReact.createElement(\"h1\", null, text),
                      ToyReact.createElement(\"p\", null, \"1\"),
                      ToyReact.createElement(\"div\", null, \"3\"),
                      a,
                      this.children,
                      true
                   );
        }
      ]
    );
    return MyComponet;
  }(ToyReact.Component);
  var myInstance = ToyReact.createElement(MyComponet, {
    name: \"self\",
    id: \"1\"
  }, ToyReact.createElement(\"div\", null, \"1\"));
  ToyReactDOM.render(myInstance, document.getElementById('root')"
);
//# sourceURL=webpack:///./index.js?");
```
