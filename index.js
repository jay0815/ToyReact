import { ToyReact, ToyReactDOM } from './src/index';

let a = <div>123</div>;

class MyComponet extends ToyReact.Component {

  render() {
    return  <div>
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      {a}
      {this.children}
      {true}
    </div>
  }
}

let myInstance = <MyComponet name='self' id='1'>
  <div>1</div>
</MyComponet>;


ToyReactDOM.render(
  myComponetInstance,
  document.getElementById('root')
)
