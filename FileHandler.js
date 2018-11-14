const yaml = require('js-yaml');
const fs   = require('fs');
const resolve = require('path').resolve;

class FileHandler {

    static readYamlFile(relativePath) {
        if (!relativePath || !(typeof relativePath === 'string')) {
            logger.error('Missing mandatory parameter "relativePath"');
            return null;
        }
        try {
            const absolutePath = resolve(relativePath);
            return yaml.safeLoad(fs.readFileSync(absolutePath, 'utf8'));
        } catch (e) {
            logger.error(e);
            return null;
        }
    }

    static readJSONFile(relativePath) {
        if (!relativePath || !(typeof relativePath === 'string')) {
            logger.error('Missing mandatory parameter "relativePath"');
            return null;
        }

        let result = {};
        try {
            const absolutePath = resolve(relativePath);
            result = require(absolutePath);
        } catch (e) {
            logger.warn('The requested file is not available. ' + relativePath);
        }
        return result;
    }

    static writeToJSON(relativePath, content) {
        try {
            fs.writeFileSync(relativePath, content, {encoding: 'utf8', flag: 'w'});
        } catch (err) {
            logger.error('Could not write to JSON: ' + err);
        }
    }

    static appendTOJSON(relativePath, content) {
        if (!relativePath) {
            logger.error('Can append to file, because no file path was provided.');
            return;
        }

        if (!content) {
            logger.error('To write without content does not make sense.');
            return;
        }

        const fileContent = this.readJSONFile(relativePath);
        if (fileContent) {
            if (Array.isArray(fileContent)) {
                logger.log(`Saved new content with length of ${content.length} to existing file with length ${fileContent.length}`);
                content = fileContent.concat(content);
                logger.log('New file length: ' + content.length);
            } else {
                logger.log(`Saved new content with length of ${Object.keys(content).length} to existing file with length ${Object.keys(fileContent).length}`);
                Object.assign(content, fileContent);
                logger.log('New file length: ' + Object.keys(content).length);
            }
        }
        this.writeToJSON(relativePath, JSON.stringify(content))
    }

}

exports.FileHander = FileHandler;

const logger = require('./LoggerProvider').getLogger(FileHandler);