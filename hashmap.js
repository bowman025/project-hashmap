export class HashMap {
    constructor() {
        this.loadFactor = 0.75;
        this.capacity = 16;
        this.buckets = new Array(this.capacity);
    }
    hash(key) {
        let hashCode = 0;
        const prime = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = (prime * hashCode + key.charCodeAt(i)) % 16;
        }
        return hashCode;
    }
    set(key, value) {
        const index = this.hash(key);
        if ( index < 0 || index >= this.buckets.length) throw new Error("Trying to access index out of bounds");
        const node = new Node(key, value);
        if (this.length() / this.capacity >= this.loadFactor) this.#grow();
        if (!this.buckets[index]) {
            this.buckets[index] = node;
            return;
        }
        let current = this.buckets[index];
        if (current.key === key) {
            this.buckets[index].value = value;
            return;
        }
        while (current.next) {
            if (current.key === key) {
                current.value = value;
                return;
            }
            current = current.next;
        }
        if (current.key === key) {
            current.value = value;
            return;
        }
        current.next = node;
    }
    get(key) {
        const index = this.hash(key);
        if (index < 0 || index >= this.buckets.length) throw new Error("Trying to access index out of bounds");
        if (!this.buckets[index]) return null;
        else {
            let current = this.buckets[index];
            while(current) {
                if (current.key === key) return current.value;
                current = current.next;
            }
        }
        return null;
    }
    has(key) {
        const index = this.hash(key);
        if ( index < 0 || index >= this.buckets.length) throw new Error("Trying to access index out of bounds");
        if (!this.buckets[index]) return false;
        else {
            let current = this.buckets[index];
            while (current) {
                if (current.key === key) return true;
                current = current.next;
            }
        }
        return false;
    }
    remove(key) {
        const index = this.hash(key);
        if ( index < 0 || index >= this.buckets.length) throw new Error("Trying to access index out of bounds");
        if (!this.buckets[index]) return false;
        if (this.buckets[index].key === key && !this.buckets[index].next) {
        this.buckets[index] = null;
        return true;
        }
        let current = this.buckets[index];
        let previous;
        while (current) {
            if (current.key === key) {
                if (previous) {
                previous.next = current.next;
                current.next = null;
                }
                else this.buckets[index] = current.next;
                return true;
            }
            previous = current;
            current = current.next;
        }
    }
    length() {
        const filteredBuckets = this.buckets.filter(Boolean);
        let length = filteredBuckets.length;
        for (let i = 0; i < filteredBuckets.length; i++) {
            let current = filteredBuckets[i];
            while (current.next) {
                current = current.next;
                length++;
            }
        }
        return length;
    }
    clear() {
        this.buckets = new Array(this.capacity);
    }
    keys() {
        let arr = [];
        const filteredBuckets = this.buckets.filter(Boolean);
        for (let i = 0; i < filteredBuckets.length; i++) {
            arr.push(filteredBuckets[i].key);
            if (filteredBuckets[i].next) {
                let current = filteredBuckets[i];
                while (current.next) {
                    current = current.next;
                    arr.push(current.key);
                }
            }
        }
        return arr;
    }
    values() {
        let arr = [];
        const filteredBuckets = this.buckets.filter(Boolean);
        for (let i = 0; i < filteredBuckets.length; i++) {
            arr.push(filteredBuckets[i].value);
            if (filteredBuckets[i].next) {
                let current = filteredBuckets[i];
                while (current.next) {
                    current = current.next;
                    arr.push(current.value);
                }
            }
        }
        return arr;
    }
    entries() {
        let arr = [];
        const filteredBuckets = this.buckets.filter(Boolean);
        for (let i = 0; i < filteredBuckets.length; i++) {
            arr.push([filteredBuckets[i].key, filteredBuckets[i].value]);
            if (filteredBuckets[i].next) {
                let current = filteredBuckets[i];
                while (current.next) {
                    current = current.next;
                    arr.push([current.key, current.value]);
                }
            }
        }
        return arr;
    }
    show() {
        return this.buckets.filter(Boolean);
    }
    #grow() {
        let oldMap = this.entries();
        this.capacity *= 2;
        this.clear();
        for (let item of oldMap) {
            this.set(item[0], item[1]);
        }
    }
}

class Node {
    constructor(key, value = null, next = null) {
        this.key = key;
        this.value = value;
        this.next = next;
    }
}