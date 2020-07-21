import { ToyReact, ToyReactDOM } from './src/index';

class Board extends ToyReact.Component {

  willMount(lifeState) {
    console.log('Board will mount', lifeState);
  }

  didMount(lifeState) {
    console.log('Board did mount', lifeState);
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Square extends ToyReact.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  willUpdate(prevState, nextState) {
    console.log('willUpdate');
    console.log('prevState', prevState, 'nextState', nextState);
  }

  didUpdate() {
    console.log('didUpdate', this.state);
  }

  render() {
    return (
      <button className="square" onClick={() => this.setState({value: 'X'})}>
        {this.state.value ? this.state.value : ''}
      </button>
    );
  }
}

let myInstance = <Board />;

ToyReactDOM.render(
  myInstance,
  document.getElementById('root')
)
