# 观察者模式/发布-订阅模式

## 观察者模式

观察者有两个角色：**观察者**和**被观察者**。
* 观察者想要订阅事件，必须将自己添加到目标中进行管理；
* 被观察者想要发布事件，必须将自己亲自触发事件。

```javascript
// 观察者
class Observer {
  constructor (name) {
    this.name = name
  }
  // 更新
   update (subject) {
    console.log(this.name, subject.state)
   }
}

// 被观察者
class Subject {
  constructor () {
    this.state = ''
    this.observers = []
  }
  // 添加观察者
  add (observer) {
    this.observers.push(observer)
  }
  // 通知观察者更新
   notify () {
    this.state = '更新'
    this.observers.forEach((observer)=> {
      observer.update(this)
    })
  }
}

// 新建观察者
var ob1 = new Observer('ob1')
var ob2 = new Observer('ob2')

// 新建目标
var sub = new Subject()

// 将观察者添加到目标里
sub.add(ob1)
sub.add(ob2)

// 通知各个观察者更新
sub.notify()
```

## 发布-订阅模式

发布-订阅模式多了个事件中心，作为调度中心，管理着**发布-订阅**的工作。
* 订阅者在订阅事件的时候，只关注事件本身，不关心谁发布这个事件；
* 发布者在发布事件的时候，只关注事件本身，不关心谁订阅了这个事件。

```javascript
class Event {
  constructor () {
    // 事件集合
    this.handler = {}
  }

  // 订阅事件
  on (eventName, callback) {
    if (this.handler[eventName]) {
      this.handler[eventName].push(callback)
    } else {
      this.handler[eventName] = [callback]
    }
  }

  // 发布事件
  emit (eventName) {
    if (this.handler[eventName]) {
      for (let i = 0; i < this.handler[eventName].length; i++) {
        this.handler[eventName][i]()
      }
    }
  }
}

// 新建事件调度中心
let event = new Event()

// 订阅事件
event.on('event1', () => {
  console.log('event 1')
})
event.on('event2', () => {
  console.log('event 2')
})

// 发布事件
event.emit('event1')
event.emit('event2')
```
