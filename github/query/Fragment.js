class Fragment {
    constructor(name, content) {
        if (!name || !content) {
            throw new TypeError('Constructor params have to be defined.');
        }
        this.name = name;
        this.content = content;
    }

    extractFragmentBody() {
        const regex = new RegExp(`fragment ${this.name} on [^{]*{\\n?((?:.|\\n)*)}`);
        const result = regex.exec(this.content);
        if (!result) {
            logger.warn('Body could not be extracted, because regex did not match on content: ', this.content);
            return null;
        }

        return result[1];
    }
}

exports.Fragment = Fragment;

const logger = require('../../LoggerProvider').getLogger(Fragment);