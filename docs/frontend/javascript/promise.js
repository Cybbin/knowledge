const PENDING = 'pending' // 等待态
const FULFILLED = 'fulfilled' // 成功态
const REJECTED = 'REJECTED' // 失败态

class MyPromise {
  constructor (executor) {
    this.status = PENDING // 默认为 pending
    this.value = undefined // 保存 resolve 的值
    this.reason = undefined // 保存 reject 的值

    this.onFulfilledCallbacks = [] // 保存 fulfilled 的回调队列
    this.onRejectedCallbacks = [] // 保存 rejected 的回调队列

    const resolve = (value) => { // 自定义 resolve 函数
      //  如果 value 是一个 promise，需要对 value 递归解析
      if (value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) { // 如果为 pending 时
        this.status = FULFILLED // 更新为 fulfilled 态
        this.value = value // 保存 resolve 的值

        // 依次执行 fulfilled 的回调
        this.onFulfilledCallbacks.forEach(cb => cb())
      }
    }

    const reject = (reason) => { // 自定义 reject 函数
      if (this.status === PENDING) { // 如果为 pending 时
        this.status = REJECTED // 更新为 rejected 态
        this.reason = reason // 保存 reject 的值

        // 依次执行 rejected 的回调
        this.onRejectedCallbacks.forEach(cb => cb())
      }
    }

    try {
      executor(resolve, reject) // 立即执行
    } catch (error) {
      reject(error) // 如果执行失败，则变成 rejected 状态，并把报错传过去
    }
  }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    // 创建一个新的 Promise
    const newPromise = new MyPromise((resolve, reject) => {
      switch (this.status) {
        case FULFILLED: // 成功，执行回调函数
          setTimeout(() => { // 异步调用
            try {
              const x = onFulfilled(this.value) // 记录返回值 x
              resolvePromise(x, newPromise, resolve, reject) // 解析 x 的值，决定调用 resolve 还是 reject
            } catch (error) {
              reject(error)
            }
          }, 0)
          break
        case REJECTED: // 失败，执行回调函数
          setTimeout(() => { // 异步调用
            try {
              const x = onRejected(this.reason) // 记录返回值 x
              resolvePromise(x, newPromise, resolve, reject) // 解析 x 的值，决定调用 resolve 还是 reject
            } catch (error) {
              reject(error)
            }
          }, 0)
          break
        case PENDING: // 调用 then 的时候状态还是 pending，需要保存对应的回调
          this.onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onFulfilled(this.value)
                resolvePromise(x, newPromise, resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
          })
          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onRejected(this.reason)
                resolvePromise(x, newPromise, resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
          })
          break
      }
    })

    return newPromise
  }

  catch (errCallback) {
    return this.then(null, errCallback)
  }

  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, err => {
      return MyPromise.resolve(callback()).then(() => { throw err })
    })
  }

  // 静态方法，默认产生一个状态为 fulfilled 的 promise
  static resolve (value) {
    return new MyPromise((resolve2, reject2) => {
      resolve2(value)
    })
  }

  // 静态方法，默认产生一个状态为 rejected 的 promise
  static reject (reason) {
    return new MyPromise((resolve2, reject2) => {
      reject2(reason)
    })
  }

  // 静态方法，解决多 promise 并发问题，等待所有promise执行完毕后，并获取最终的结果再执行回调
  static all (values) {
    return new MyPromise((resolve, reject) => {
      const resultArr = []
      let count = 0
      const processResultByKey = (value, index) => {
        resultArr[index] = value
        if (++count === values.length) {
          resolve(resultArr)
        }
      }

      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (typeof value.then === 'function') {
          value.then((val) => {
            processResultByKey(val, i)
          }, reject)
        } else {
          processResultByKey(value, i)
        }
      }
    })
  }
}

// 解析 x 的值，决定 newPromise 是成功还是失败
const resolvePromise = (x, newPromise, resolve, reject) => {
  // 返回值不能和新的 Promise 引用同一个
  if (x === newPromise) {
    reject(new TypeError('TypeError:'))
  }
  let called
  // 如果x是一个对象或函数
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = x.then

      if (typeof then === 'function') {
        // x 是promise, 复用上次取出的 then
        then.call(x, (y) => {
          // 只允许 call 一次
          if (called) return
          called = true
          // 这里的y有可能是一个 Promise，递归解析y的值，知道这个值是一个普通值
          resolvePromise(y, newPromise, resolve, reject)
        }, (r) => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x) // x 是普通对象或函数，直接执行成功函数
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 普通值
    resolve(x) // 直接执行成功函数
  }
}

// 静态方法，产生延迟对象
MyPromise.defer = MyPromise.deferred = function () {
  const dfd = {}
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

// const promise = new MyPromise(function executor (resolve, reject) {
//   reject('start')
// })

function read () {
  const dfd = MyPromise.defer()
  setTimeout(() => {
    dfd.resolve('1')
  }, 1000)
  return dfd.promise
}

MyPromise.all([1, 2, 3, new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(4)
  }, 1000)
}), new Promise((resolve, reject) => {
  resolve(5)
})]).then(data => {
  console.log('success', data)
}, err => {
  console.log('err', err)
})

// promise.then((value) => {
//   console.log('success1', value)
//   return new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('setTimeout1')
//       resolve(new MyPromise((resolve1, reject1) => {
//         setTimeout(() => {
//           console.log('setTimeout2')
//           resolve1('111')
//         }, 1000)
//       }))
//     }, 1000)
//   })
// }).then((value) => {
//   console.log('success2', value)
// }, (reason) => {
//   console.log('fail2', reason)
// })
