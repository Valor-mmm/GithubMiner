class Fragment {
    constructor(name, content) {
        if (!name || !content) {
            throw new TypeError('Constructor params have to be defined.');
        }
        this.name = name;
        this.content = content;
    }
}

module.exports = Fragment;