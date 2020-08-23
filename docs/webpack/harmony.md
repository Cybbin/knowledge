# harmony

## commonjs 加载 commonjs

准备文件：
```js
// people.js
module.exports = {
  name: 'cyb'
}

// index.js
let people = require('./people.js')
console.log(people)
// people = {name: "cyb"}
```

打包后：
```js
{
  "./src/index.js": (function(module, exports, __webpack_require__) {
    let people = __webpack_require__("./src/people.js")
    console.log(people)
  }),
  "./src/people.js": (function(module, exports) {
    module.exports = {
      name: 'cyb'
    }
  })
}
```

## commonjs 加载 ES6 Module

准备文件：
```js
// people
export const age = 10
export default {
  name: 'cyb'
}

// index.js
let people = require('./people.js')
console.log(people) // people = { default: {name:"cyb"}, age: 10, __esModule: true, Symbol(Symbol.toStringTag):"Module"}
```

打包后：
```js
{
  "./src/index.js": (function(module, exports, __webpack_require__) {
    let people = __webpack_require__(/*! ./people.js */ "./src/people.js")
    console.log(people)
  }),
  "./src/people.js": (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    const age = 10
    __webpack_exports__["default"] = ({
      name: 'cyb'
    });
  })
}
```

## ES6 Module 加载 commonjs

准备文件：
```js
// people.js
module.exports = {
  name: 'cyb'
}

// index.js
import people from './people.js'
console.log(people)
```

打包后：
```js
{
  "./src/index.js": (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    var _people_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/people.js");
    var _people_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_people_js__WEBPACK_IMPORTED_MODULE_0__);
    console.log(_people_js__WEBPACK_IMPORTED_MODULE_0___default.a)
  }),
  "./src/people.js":(function(module, exports) {
    module.exports = {
      name: 'cyb'
    }
  })
}
```

## ES6 Module 加载 ES6 Module


准备文件：
```js
// people.js
export const age = 10
export default {
  name: 'cyb'
}

// index.js
import people, { age } from './people.js'
console.log(people, age) 
// people = { name: "cyb"}
// age = 10
```

打包后：
```js
{
  "./src/index.js": (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    var _people_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/people.js");
    console.log(_people_js__WEBPACK_IMPORTED_MODULE_0__["default"], _people_js__WEBPACK_IMPORTED_MODULE_0__["age"])
  }),
  "./src/people.js":(function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });

    const age = 10
    __webpack_exports__["default"] = ({
      name: 'cyb'
    });
  })
}
```