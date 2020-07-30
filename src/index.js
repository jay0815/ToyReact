
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
        if(child === null || child === void 0) {
            child = '';
        }
        if(!(child instanceof Component || child instanceof ElementWrapper || child instanceof TextWrapper)) {
          // support function render template
          if(typeof child !== 'function'){
            child = child +'';
          }
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
    this.LIFE_CYCLE_STATE = 'init';
  }

  get type() {
    return this.constructor.type;
  }

  setAttribute(attribute, value) {
    // ---------------------------
    // ---- add Event Listener ---
    // ---------------------------
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
    if(this.LIFE_CYCLE_STATE === 'init') {
      if(typeof this.willMount === 'function'){
        this.willMount(JSON.stringify(this.LIFE_CYCLE_STATE));
      }
    }
    this.range = range;
    this.update();
    // did mount
    if(this.LIFE_CYCLE_STATE === 'mounted') {
      if(typeof this.didMount === 'function'){
        this.didMount(JSON.stringify(this.LIFE_CYCLE_STATE));
      }
    }
  }

  update() {
    // let placeholder = document.createComment('placeholder');
    // let range = document.createRange();
    // range.setStart(this.range.endContainer, this.range.endOffset)
    // range.setEnd(this.range.endContainer, this.range.endOffset);
    // range.insertNode(placeholder);
    // this.range.deleteContents();
    const vdom = this.vdom;
    if(this.lastVDOM) {
      const isSameNode = (nextTreeNode, localTreeNode) => {
        if(!nextTreeNode || !localTreeNode) {
          return false
        }
        if(nextTreeNode.type !== localTreeNode.type){
          return false
        }
        for(let name in nextTreeNode.props) {
          // if(
          //     typeof nextTreeNode.props[name] === 'function'
          //     && typeof localTreeNode.props[name] === 'function'
          //     && localTreeNode.props[name].toString() === nextTreeNode.props[name].toString()
          //   ){
          //       continue;
          //   }
          if(
              typeof nextTreeNode.props[name] === 'object'
              && typeof localTreeNode.props[name] === 'object'
              && JSON.stringify(localTreeNode.props[name]) === JSON.stringify(nextTreeNode.props[name])
            ){
                continue;
            }
          if(nextTreeNode.props[name] !== localTreeNode.props[name]){
            return false
          }
        }
        if(Object.keys(nextTreeNode.props).length !== Object.keys(localTreeNode.props).length) {
          return false
        }
        return true
      }

    const isSameTree = (nextTree, localTree) => {
      if(!isSameNode(nextTree, localTree)) {
        return false
      }
      if(nextTree.children.length !== localTree.children.length) {
        return false
      }
      for(let i = 0; i < nextTree.children.length; i++) {
        if(!isSameTree(nextTree.children[i], localTree.children[i])){
          return false
        }
      }
      return true
    }

    const replace = (nextTree, localTree, localTreeParent) => {
      if(isSameTree(nextTree, localTree)){
        return;
      }
      if(!isSameNode(nextTree, localTree)) {
        if(typeof localTree === 'undefined' && typeof localTreeParent !== 'undefined') {

        }else {
          console.log('localTree.range', localTree, localTree.range);
          nextTree.mountTo(localTree.range);
        }
      }else {
        for(let i = 0; i < nextTree.children.length; i++) {
          // console.log('localTree.children[i]', localTree.children[i]);
          replace(nextTree.children[i], localTree.children[i])
        }
      }
    }
      replace(vdom, this.lastVDOM);

    }else {
      vdom.mountTo(this.range);
    }

    this.lastVDOM = vdom;

    if(this.LIFE_CYCLE_STATE === 'init'){
      this.changeLifeCycleState('mounted');
    }
  }

  get vdom() {
    return this.render().vdom;
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
        if(typeof nextState[s] === 'object' && nextState[s] !== null){
          if(typeof prevState[s] !== 'object'){
              if(nextState[s] instanceof Array) {
                prevState[s] = [];
              }else {
                prevState[s] = {};
              }
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
      if(this.LIFE_CYCLE_STATE === 'mounted'){
        // will Update
        if(this.LIFE_CYCLE_STATE === 'mounted') {
          if(typeof this.willUpdate === 'function'){
            this.willUpdate(prevState, nextState);
          }
        }
      }
      this.update();
      if(this.LIFE_CYCLE_STATE === 'mounted'){
        console.log('didUpdate');
        // did Update
        if(this.LIFE_CYCLE_STATE === 'mounted') {
          if(typeof this.didUpdate === 'function'){
            this.didUpdate();
          }
        }
      }
    }
  }

  changeLifeCycleState(nextLifeState) {
    this.LIFE_CYCLE_STATE = nextLifeState;
  }
}

let childrenSymbol = Symbol('children');

class ElementWrapper {
  constructor(type) {
    // this.root = document.createElement(type);
    this.type = type;
    this[childrenSymbol] = [];
    this.children = [];
    this.props = Object.create(null);
  }

  setAttribute(attribute, value) {
    // ---------------------------
    // ---- add Event Listener ---
    // ---------------------------
    // if(attribute.match(/^on([\s\S]+)$/)){
    //   // let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
    //   this.root.addEventListener(RegExp.$1.toLowerCase(), value);
    // }
    // if(attribute === 'className'){
    //   attribute = 'class';
    // }
    // this.root.setAttribute(attribute, value);
    this.props[attribute] = value;
  }

  // get children() {
  //   return this[childrenSymbol].map((child) => child.vdom);
  // }

  appendChild(vchild) {
    this[childrenSymbol].push(vchild);
    this.children.push(vchild.vdom);
    // const range = document.createRange();
    // if(this.root.children.length){
    //   range.setStartAfter(this.root.lastChild)
    //   range.setEndAfter(this.root.lastChild)
    // }else {
    //   range.setStart(this.root, 0)
    //   range.setEnd(this.root, 0)
    // }
    // vchild.mountTo(range)
  }

  get vdom() {
    return this
  }

  mountTo(range) {
    this.range = range;
    let placeholder = document.createComment('placeholder');
    let endRange = document.createRange();
    console.log('range', range);
    endRange.setStart(range.endContainer, this.range.endOffset)
    endRange.setEnd(range.endContainer, this.range.endOffset);
    endRange.insertNode(placeholder);
    // this.range.deleteContents();
    range.deleteContents();
    const element = document.createElement(this.type);

    for(let attribute in this.props) {
      const value = this.props[attribute];
      if(attribute.match(/^on([\s\S]+)$/)){
        let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
        element.addEventListener(eventName, value);
        // element.addEventListener(RegExp.$1.toLowerCase(), value);
      }
      if(attribute === 'className'){
        element.setAttribute('class', value)
      }
      element.setAttribute(attribute, value)
    }
    for(let child of this.children) {
      const range = document.createRange();
      if(element.children.length){
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      }else {
        range.setStart(element, 0)
        range.setEnd(element, 0)
      }
      child.mountTo(range)
    }

    range.insertNode(element);
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type);
    this.type = '#text';
    this.children = [];
    this.props = Object.create(null);
  }

  mountTo(range) {
    this.range = range;
    range.deleteContents();
    range.insertNode(this.root);
  }

  get vdom() {
    return this
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
