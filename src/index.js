
function createElement(...rest) {
  console.log('createElement', rest);
  console.log('first arg', typeof rest[0]);
}

export const ToyReact = {
  createElement
}
