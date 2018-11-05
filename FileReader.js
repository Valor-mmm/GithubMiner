const yaml = require('js-yaml');
const fs   = require('fs');
const resolve = require('path').resolve;

class FileReader {

    static readYamlFile(relativePath) {
        if (!relativePath || !(typeof relativePath === 'string')) {
            console.error('Missing mandatory parameter "relativePath"');
            return null;
        }
        try {
            const absolutePath = resolve(relativePath);
            console.log(absolutePath);
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

}

module.exports = FileReader;