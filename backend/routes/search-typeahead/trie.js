class TrieNode {
    constructor () {
        this.children = {}
        this.isEndOfWord = false
        this.contactData = []
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode()
    }

    insert(contact) {
        let node = this.root;
        const name = contact.name.toLowerCase();
        for (let char of name) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char]
        }
        node.isEndOfWord = true
        node.contactData.push(contact)
    }

    searchPrefix(prefix) {
        let node = this.root;
        const normalizedPrefix = prefix.toLowerCase();

        for (let char of normalizedPrefix) {
            if (!node.children[char]) {
                return null
            }
            node = node.children[char]
        }
        return node.isEndOfWord
    }

    findContactsWithPrefix(prefix) {
        const results = []
        const node = this.searchPrefix(prefix)

        if (node) {
            this._findAllContacts(node, prefix, results);
        }
        return results
    }

    _findAllContacts(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push(prefix)
        }
        for (let char in node.children) {
            this._findAllContacts(node.children[char], prefix + char, results)
        }
    }
}

module.exports = Trie