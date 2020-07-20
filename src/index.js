
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
    this.children = []
  }


  setAttribute(attribute, value) {
    this[attribute] = value
  }

  mountTo(parent) {
    const vdom = this.render();
    vdom.mountTo(parent);
  }

  appendChild(child) {
    this.children.push(child)
  }
}


class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(attribute, value) {
    this.root.setAttribute(attribute, value);
  }

  appendChild(vchild) {
    vchild.mountTo(this.root)
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

function render(vdom, root) {
  vdom.mountTo(root);
}

export const ToyReactDOM = {
  render
}


export const ToyReact = {
  createElement,
  Component: Component
}
