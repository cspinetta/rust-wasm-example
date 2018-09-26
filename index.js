var isNode=new Function("try {return this===global;}catch(e){return false;}");

if (isNode()) {
  bundle = require('./bundle');
  path = require('path');
} else {
  path = { dirname: () => '.' }
}

bundle.fetchAndInstantiate(path.dirname(isNode() ? __filename : '') + "/functions.wasm", {})
.then(mod => {

  // console.log(mod.exports);
  // console.log(process.argv.slice(2));

  const str = retrieveString();
  let buf = bundle.newString(mod.exports, str); // manual alloc

  let outptr = mod.exports.reverse(buf); // library call
  const reverseString = bundle.copyCStr(mod.exports, outptr); // read c string into js string

  let hash = mod.exports.sha1(buf); // library call
  const hashString = bundle.copyCStr(mod.exports, hash); // read c string into js string

  console.log("String: " + str);
  console.log("Reverse: " + reverseString);
  console.log("SHA1: " + hashString);

  mod.exports.dealloc_str(buf); // manual free
});

function retrieveString() {
  return process.argv.length > 2 ? process.argv[2] : 'hello world';
}
