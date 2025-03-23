function createNode(value) {
  return {
    value: value,
    prev: null,
    next: null,
  };
}

class LinkedList {
  constructor(value) {
    let temp;
    this.size = 1;

    if (value === undefined) {
      temp = null;
      this.size = 0;
    } else {
      temp = createNode(value);
      this.size = 1;
    }

    this.head = temp;
    this.tail = temp;
  }

  append(value) {
    this.size++;
    const node = createNode(value);
    if (this.getHead() === null) {
      this.head = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
    }
    this.tail = node;
  }

  prepend(value) {
    const node = createNode(value);

    if (this.getHead() !== null) this.head.prev = node;

    this.size++;
    node.next = this.head;
    this.head = node;
  }

  getlength() {
    return this.size;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  at(n) {
    let i = 0;
    let cursor = this.head;

    while (i !== n) {
      cursor = cursor.next;
      if (cursor === null) return null;
      i++;
    }
    return cursor;
  }

  pop() {
    if (this.size === 0) return null;

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
      this.size = 0;
      return;
    }

    this.tail = this.tail.prev;
    this.tail.next = null;
    this.size--;
  }

  contains(item) {
    let cursor = this.head;

    while (cursor !== null) {
      if (JSON.stringify(cursor.value) === JSON.stringify(value)) return true;

      cursor = cursor.next;
    }

    return false;
  }

  find(item) {
    let cursor = this.head;
    let i = 0;

    while (cursor !== null) {
      if (cursor.value.key === item.key) return i;
      cursor = cursor.next;
      i++;
    }

    return null;
  }

  toString() {
    let cursor = this.head;
    let string = "";

    while (cursor != null) {
      cursor.next === null
        ? (string += `(${cursor.value})`)
        : (string += `(${cursor.value}) --> `);
      cursor = cursor.next;
    }

    console.log(string);
  }

  insertAt(value, index) {
    const newNode = createNode(value);

    if (value === undefined && index === undefined) return null;

    if (index === 0) {
      console.log("prepend");
      this.prepend(value);
      return;
    }

    if (index === this.length()) {
      console.log("append");
      this.append(value);
      return;
    }

    if (index > this.length() || index < 0) {
      console.log("null");
      return null;
    }

    let i = 0;
    let cursor = this.head;

    while (i !== index) {
      if (cursor === null) {
        return cursor;
      }

      cursor = cursor.next;
      i++;
    }

    const previous = cursor.prev;
    previous.next = newNode;
    cursor.prev = newNode;

    newNode.prev = previous;
    newNode.next = cursor;

    this.size++;
  }

  removeAt(index) {
    let cursor = this.head;
    let i = 0;

    if (index === undefined) return null;

    if (index === 0) {
      this.head = this.head.next;
      return;
    }

    if (index === this.getlength() - 1) {
      this.pop();
      return;
    }

    if (index >= this.getlength() || index < 0) {
      return null;
    }

    while (i !== index) {
      cursor = cursor.next;
      i++;
    }

    // console.log(cursor);
    const previous = cursor.prev;
    const next = cursor.next;

    previous.next = cursor.next;
    next.prev = cursor.prev;

    this.size--;
  }
}

class HashMap {
  #map;
  #limit;
  #loadFactor;
  #capacity;
  #occupied;

  constructor() {
    this.#capacity = 16;
    this.#loadFactor = 0.75;
    this.#limit = this.#capacity * this.#loadFactor;
    this.#occupied = 0;
    this.#map = [];
    this.keyCache = [];
  }

  expand() {
    const keyValuePair = this.entries();
    this.#capacity *= 2;
    this.#limit = this.#capacity * this.#loadFactor;
    this.#occupied = 0;
    this.keyCache = [];
    this.clear();

    for (const item of keyValuePair) {
      this.set(item[0], item[1]);
    }
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.#capacity;
    }
    return hashCode;
  }

  set(key, value) {
    const hashCode = this.hash(key);
    const item = { key: key, value: value };

    if (this.#map[hashCode] === undefined) {
      this.#map[hashCode] = new LinkedList();
    }

    const list = this.#map[hashCode];
    const index = list.find(item);

    if (index === null) {
      list.append(item);
      this.keyCache.push(key);
      this.#occupied++;
    } else {
      list.at(index).value = item;
    }

    if (this.#occupied > this.#limit) this.expand();
  }

  get(key) {
    const hashCode = this.hash(key);
    const list = this.#map[hashCode];
    if (list === null) return null;

    const index = list.find({ key: key });
    if (index === null) return null;
    const item = list.at(index);
    return item.value.value;
  }

  has(key) {
    const hashCode = this.hash(key);
    const list = this.#map[hashCode];
    if (list === null) return false;
    if (list.find({ key: key }) !== null) return true;
    return false;
  }

  remove(key) {
    if (!this.has(key)) return false;
    const hashCode = this.hash(key);
    const list = this.#map[hashCode];
    const index = list.find({ key: key });
    list.removeAt(index);
  }

  length() {
    return this.keyCache.length;
  }

  clear() {
    this.#map = [];
  }

  keys() {
    const tempCache = [];

    for (const key of this.keyCache) {
      if (this.get(key) !== null) tempCache.push(key);
    }

    this.keyCache = tempCache;
    return this.keyCache;
  }

  values() {
    const valuesArray = [];
    const keys = this.keys();

    for (const key of keys) {
      valuesArray.push(this.get(key));
    }

    return valuesArray;
  }

  entries() {
    const keyValuePair = [];
    const keysArray = this.keys();
    const valuesArray = this.values();

    for (let i = 0; i < keysArray.length; i++) {
      keyValuePair.push([keysArray[i], valuesArray[i]]);
    }

    return keyValuePair;
  }
}
const test = new HashMap(); // or HashMap() if using a factory
test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
test.set("moon", "silver");

test.set("moon", "tsuki");
test.set("apple", "ringo");
test.set("ice cream", "aisu kurimu");

for (let i = 0; i < 12; i++) {
  test.set(`test${i}`, `test${i + 1}`);
}
