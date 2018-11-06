const yaml = require('js-yaml');
const fs   = require('fs');
const resolve = require('path').resolve;

class FileHandler {

    static readYamlFile(relativePath) {
        if (!relativePath || !(typeof relativePath === 'string')) {
            console.error('Missing mandatory parameter "relativePath"');
            return null;
        }
        try {
            const absolutePath = resolve(relativePath);
            return yaml.safeLoad(fs.readFileSync(absolutePath, 'utf8'));
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static readJSONFile(relativePath) {
        if (!relativePath || !(typeof relativePath === 'string')) {
            console.error('Missing mandatory parameter "relativePath"');
            return null;
        }

        return require(relativePath);
    }

    static writeToJSON(relativePath, content) {
        try {
            fs.appendFileSync(relativePath, content);
        } catch (err) {
            console.error('Could not write to JSON: ' + err);
        }
    }

}

module.exports = FileHandler;