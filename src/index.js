
function createElement(type, attributes, ...children) {
  let element = null;
  if(typeof type === 'string') {
    element = new ElementWrapper(type)
  }else {
    element = new type;
  }
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }

  const insertChildren = (children) => {
    for(let child of children){
      if(Array.isArray(child)){
        insertChildren(child)
      }else {
        if(!(child instanceof Component || child instanceof ElementWrapper || child instanceof TextWrapper)) {
          child = child +'';
        }
        if(typeof child === 'string') {
          child = new TextWrapper(child);
        }
        element.appendChild(child);
      }
    }
  }

  insertChildren(children)

  return element;
}

class Component {

  constructor() {
    this.children = [];
    this.props = Object.create(null);
    this.LIFTE_CYCLE_STATE = 'init';
  }

  setAttribute(attribute, value) {
    if(attribute.match(/^on([\s\S]+)$/)){
      // let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
      // this.root.addEventListener(RegExp.$1.toLowerCase(), value);
    }
    if(attribute === 'className'){
      attribute = 'class';
    }
    this.props[attribute] = value;
    this[attribute] = value
  }

  mountTo(range) {
    // will mount
    if(this.LIFTE_CYCLE_STATE === 'init') {
      if(typeof this.willMount === 'function'){
        this.willMount(JSON.stringify(this.LIFTE_CYCLE_STATE));
      }
    }
    this.range = range;
    this.update();
    // did mount
    if(this.LIFTE_CYCLE_STATE === 'mounted') {
      if(typeof this.didMount === 'function'){
        this.didMount(JSON.stringify(this.LIFTE_CYCLE_STATE));
      }
    }
  }

  update() {
    let placeholder = document.createComment('placeholder');
    let range = document.createRange();
    range.setStart(this.range.endContainer, this.range.endOffset)
    range.setEnd(this.range.endContainer, this.range.endOffset);
    range.insertNode(placeholder);
    this.range.deleteContents();
    const vdom = this.render();
    vdom.mountTo(this.range);
    if(this.LIFTE_CYCLE_STATE === 'init'){
      this.changeLIFTE_CYCLE_STATE('mounted');
    }
  }

  appendChild(child) {
    this.children.push(child)
  }

  setState(state) {
    if(typeof state === 'undefined') {
      return void 0;
    }
    const merge = (prevState, nextState) => {
      for(let s in nextState) {
        if(typeof nextState[s] === 'object'){
          if(typeof prevState[s] !== 'object'){
            prevState[s] = {};
          }
          merge(prevState[s], nextState[s])
        }else {
          prevState[s] = nextState[s];
        }
      }
      return prevState
    }
    if(!this.state) {
      this.state = {}
    }
    const prevState = JSON.parse(JSON.stringify(this.state));
    const nextState = merge(this.state, state);

    // TODO: diff prevState & nextState
    // if same will not update
    // else excute update
    // diff need be replace by  a high efficiency way
    const diff = (prevState, nextState) => {
      return JSON.stringify(prevState) !== JSON.stringify(nextState)
    }
    if(diff(prevState, nextState)) {
      if(this.LIFTE_CYCLE_STATE === 'mounted'){
        // will Update
        if(this.LIFTE_CYCLE_STATE === 'mounted') {
          if(typeof this.willUpdate === 'function'){
            this.willUpdate(prevState, nextState);
          }
        }
      }
      this.update();
      if(this.LIFTE_CYCLE_STATE === 'mounted'){
        console.log('didUpdate');
        // did Update
        if(this.LIFTE_CYCLE_STATE === 'mounted') {
          if(typeof this.didUpdate === 'function'){
            this.didUpdate();
          }
        }
      }
    }
  }

  changeLIFTE_CYCLE_STATE(nextLIFTE_CYCLE_STATE) {
    this.LIFTE_CYCLE_STATE = nextLIFTE_CYCLE_STATE;
  }
}


class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(attribute, value) {
    if(attribute.match(/^on([\s\S]+)$/)){
      // let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
      this.root.addEventListener(RegExp.$1.toLowerCase(), value);
    }
    if(attribute === 'className'){
      attribute = 'class';
    }
    this.root.setAttribute(attribute, value);
  }

  appendChild(vchild) {
    const range = document.createRange();
    if(this.root.children.length){
      range.setStartAfter(this.root.lastChild)
      range.setEndAfter(this.root.lastChild)
    }else {
      range.setStart(this.root, 0)
      range.setEnd(this.root, 0)
    }
    vchild.mountTo(range)
  }

  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type);
  }

  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

function render(vdom, root) {
  let range = document.createRange();
  if(root.children.length){
    range.setStartAfter(root.lastChild);
    range.setEndAfter(root.lastChild);
  }else {
    range.setStart(root, 0);
    range.setEnd(root, 0);
  }
  vdom.mountTo(range);
}

export const ToyReactDOM = {
  render
}


export const ToyReact = {
  createElement,
  Component: Component
}
