class TrieNode {
    constructor () {
        this.children = {}
        this.isEndOfWord = false
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode()
    }

    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            let char = word[i]
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char]
        }
        node.isEndOfWord = true
    }

    search(word) {
        let node = this.root;

        for (let i = 0; i < word.length; i++) {
            let char = word[i]

            if (!node.children[char]) {
                return false;
            }
            node = node.children[char]
        }
        return node.isEndOfWord
    }

    searchPrefix(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            let char = prefix[i]
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char]
        }
        return true
    }

    findWordsWithPrefix(prefix) {
        const results = []
        const node = this.searchPrefix(prefix)

        if (node) {
            this._findAllWords(node, prefix, results);
        }
        return results
    }

    _findAllWords(node, prefix, results) {
        if (node.isEndOfWord) {
            results.push(prefix)
        }
        for (let char in node.children) {
            this._findAllWords(node.children[char], prefix + char, results)
        }
    }
}

module.exports = Trie