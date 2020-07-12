# 单向链表

各个节点通过指针的方式串联起来，构成链表。

<img :src="$withBase('/assets/data-structure/link-list/link-list.png')"/>

```js
class Node {
  constructor (element, next) {
    this.element = element
    this.next = next
  }
}

class LinkedList {
  constructor () {
    this.clear()
  }

  _getNodeByIndex (index) {
    let node = this.head
    for (let i = 0; i < index; i++) {
      node = node.next
    }

    return node
  }

  add (index, element) {
    if (arguments.length === 1) {
      element = index
      index = this.size
    }

    if (index === 0) {
      let head = this.head
      this.head = new Node(element, head)
    } else {
      let node = this._getNodeByIndex(index - 1)
      node.next = new Node(element, node.next)
    }

    this.size++
  }

  get (index) {
    return this._getNodeByIndex(index)
  }

  set (index, element) {
    return this._getNodeByIndex(index).element = element
  }

  remove (index) {

    if (index === 0) {
      this.head = this.head.next
    } else {
      let node = this._getNodeByIndex(index - 1)
      node.next = node.next.next
    }

    this.size--
  }

  clear () {
    this.head = null
    this.size = 0
  }
}

var list = new LinkedList()

// [2,3,1]
list.add(1)
list.add(0, 2)
list.add(1, 3)

// console.log(list.get(0).element)
// console.log(list.get(1).element)
// console.log(list.get(2).element)
// console.log(list.set(2, 4))

// list.remove(0)

console.dir(list, {depth:20})
```
