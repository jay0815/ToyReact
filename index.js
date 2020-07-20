import { ToyReact, ToyReactDOM } from './src/index';

let a = <div>a</div>;

let text = 'Hello ToyReact'

class MyComponet extends ToyReact.Component {

  render() {
    return  <article>
      <h1>{text}</h1>
      <p>1</p>
      <div>3</div>
      {a}
      {this.children}
      {true}
    </article>
  }
}

let myInstance = <MyComponet name='self' id='1'>
  <div>1</div>
</MyComponet>;


ToyReactDOM.render(
  myInstance,
  document.getElementById('root')
)
